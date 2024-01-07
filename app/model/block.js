const fs = require("fs")

const http_tool = appload('tool/http')
const config = appload('config')

setTimeout(function(){
    appload('model/scanblock')
}, 1000)


///////////////////////////////////////////////


let lastblockdata = {}

// 定时获取 last block 信息
async function queryLastBlock(){
    try{
        let jsonobj = await http_tool.json(config.miner_api_url+"/query?action=lastblock")
        // console.log(jsonobj)
        // ok
        lastblockdata = jsonobj
    }catch(e){
        console.log(e)
    }

}
setInterval(queryLastBlock, 1000 * 13)
queryLastBlock()


////////////////////////////////////////////////


let blockdatacache_maps = {} // 数据缓存
let recentblockscahce = [] // 缓存

let blockforkslogary = [] // string
let frkblklgfn = './static/datas/forkblocks.log'
try{
    blockforkslogary = (fs.readFileSync(frkblklgfn) + '').split("\n")
}catch(e){}
// console.log(blockforkslogary)


function storeBlockForksLog(recentblocks) {
    if(recentblocks.length <= 1) {
        return // not fork
    }
    let lghei = 0
    if(blockforkslogary.length) {
        let h = parseInt(blockforkslogary[0].split(",")[0])
        if(h>0){
            lghei = h
        }
    }
    if(recentblocks[0].height <= lghei){
        return // already do log
    }
    let lgs = []
    for(let i in recentblocks){
        let o = recentblocks[i]
        lgs.push(`${o.height},${o.hx},${o.prev},${o.txs},${o.miner},${o.msg.replace(/,/g,'')},${o.arrive}`)
    }
    blockforkslogary.unshift(lgs.join('|'))
    if(blockforkslogary.length > 200) {
        blockforkslogary.pop() // delete tail
    }
    let filecon = blockforkslogary.join("\n")
    fs.writeFile(frkblklgfn, filecon, function(){

    })
}





// 从缓存里取数据
function getBlocksFromCache(last, limit) {
    // console.log(blockdatacache_maps)
    let start = last - limit + 1
    let results = []
    for(let i=start; i<=last; i++){
        let one = blockdatacache_maps[''+i]
        // console.log(one)
        if( ! one ){
            return i // ret start_height
        }
        results.unshift( one )
    }
    // console.log("results", results.length)
    return results
}

async function getBlocks(last, limit) {
    if( !last || !limit ){
        return []
    }
    if( last > lastblockdata.height ){
        limit -= last - lastblockdata.height
        last = lastblockdata.height
    }
    // 从缓存取数据
    let caches = getBlocksFromCache(last, limit)
    if( typeof caches == "object" ){
        // console.log("getBlocksFromCache", last, limit)
        return caches
    }
    let start_height = parseInt(last) - parseInt(limit) + 1
    if( typeof caches == "number" ){
        start_height = caches
    }
    try{
        // console.log("await http_tool.json(config.miner_api_url", "end_height:", last, "start_height:", start_height, "limit:", last-start_height+1)
        let jsonobj = await http_tool.json(config.miner_api_url+"/query", {
            action: "blocks",
            start_height: start_height,
            end_height: last,
        })
        // console.log( "------------")
        // console.log( jsonobj.datas)
        let datas = jsonobj.datas
        // ok 保存数据至缓存
        let delete_keys = []
        for(let i in datas){
            let k = datas[i].height+''
            delete_keys.push(k)
            datas[i].bitstr = getDealBitStr(datas[i].bits)
            blockdatacache_maps[k] = datas[i]
        }
        // 定时清除缓存
        setTimeout(function(){
            for(let k in delete_keys){
                delete blockdatacache_maps[k]
            }
            // console.log("delete blocks cache key", delete_keys.join(','))
        }, 1000*60*24) // 保存一天内的数据 288blk
        // 再次从缓存取数据
        return getBlocksFromCache(last, limit)
    }catch(e){
        return []
    }
}


async function queryRecentBlocks() {
    var blocks = []
    try{
        // console.log("await http_tool.json(config.miner_api_url", "end_height:", last, "start_height:", start_height, "limit:", last-start_height+1)
        let jsonobj = await http_tool.json(config.miner_api_url+"/query", {
            action: "recentblocks",
            brief: "true",
        })
        // console.log(jsonobj)
        if(jsonobj && jsonobj.list.length) {
            blocks = jsonobj.list
        }
        // test
        // blocks = testblocks()
    }catch(e){
        return []
    }
    if(!blocks.length) {
        return []
    }

    // clear cache
    recentblockscahce = []

    // insert
    function havchilds(list, blk) {
        if(!list) return false
        for(var i in list) {
            if(list[i].hx == blk.hx){
                return true
            }
        }
        return false
    }
    function insertInTree(listptr, blk) {
        let fdi = false
        for(let i in listptr){
            let li = listptr[i]
            li.nexts = li.nexts || []
            blk.nexts = blk.nexts || []
            if(li.hx == blk.prev) {
                if(!havchilds(li.nexts, blk)){
                    li.nexts.push(blk)
                }
                fdi = true
                break
            }else if(li.prev == blk.hx){
                blk.nexts.push(li)
                listptr[i] = blk
                fdi = true
                break
            }else if(li.hx == blk.hx){
                return true
            }else if(li.nexts.length){
                fdi = insertInTree(li.nexts, blk)
                if(fdi) {
                    return true
                }
            }
        }
        return fdi
    }

    // do insert
    function doInsert(blocks) {
        var other_blocks = []
        for(let k in blocks){
            let blk = blocks[k]
            let fdi = insertInTree(recentblockscahce, blk)
            if (!fdi) {
                if(recentblockscahce.length) {
                    other_blocks.push(blk)
                }else{
                    recentblockscahce.push(blk)
                }
            }
        }
        return other_blocks
    }
    var nextloop_blocks = doInsert(blocks)
    var nextloop_counts = 0
    do {
        nextloop_counts++;
        nextloop_blocks = doInsert(nextloop_blocks)
    } while(nextloop_blocks.length>0 && nextloop_counts < 6)
    for(var i in nextloop_blocks){
        recentblockscahce.push(nextloop_blocks[i]) // 孤块
    }

    // set hi
    function setLvHi(h, list) {
        for(var i in list) {
            list[i].hi = h
            setLvHi( h+1, list[i].nexts||[])
        }
    }
    setLvHi(0, recentblockscahce)
   
    // 保存分叉日志
    storeBlockForksLog(recentblockscahce)

    // 定时清除缓存
    // if(!not_clean_cache) {
    //     setTimeout(function(){
    //         recentblockscahce = []
    //     }, 1000*77)
    // }

    // 缓存写入并返回
    return recentblockscahce
}


// 定时清除缓存
setInterval(queryRecentBlocks, 1000*17)



function getDealBitStr(bits) {
    return bits
    // let buf = Buffer.allocUnsafe(4)
    // buf.writeUInt32BE(bits, 0)
    // let n1 = 255 - buf.readUInt8(0)
    // let n2 = 16777215 - ( buf.readUInt16BE(1) * 256 + buf.readUInt8(3) )
    // return '2^' + n1 + '×' + n2
}


////////////////////////////////////////////////


exports.getLastBlock = async function()
{
    return lastblockdata
}


exports.getBlocks = async function(last, limit, clean_cache){
    if(clean_cache){
        blockdatacache_maps = {} // 清除缓存
    }
    return await getBlocks(last, limit)
}

exports.getRecentBlocks = async function(clean_cache){
    if(clean_cache){
        recentblockscahce = [] // 清除缓存
    }
    if(recentblockscahce.length){
        return recentblockscahce // 返回缓存
    }
    return await queryRecentBlocks()
}

////////////////////////////////////////////////

let rankingShowDataCache = null 
let rankingShowDataUphour = new Date().getHours()
exports.getRankingShowData = async function() {
    let isovertime = rankingShowDataUphour != new Date().getHours()
    if(!rankingShowDataCache || isovertime){
        // console.log('getRankingShowData from req')
        // req data from ranking
        let retdata = {
            accounts: {},
            turnover: {},
        }
        // accounts
        try{
            let jsonobj = await http_tool.json(config.miner_api_url+"/query?action=totalnonemptyaccount")
            // console.log(jsonobj)
            retdata.accounts = jsonobj
        }catch(e){
            console.log(e)
        }
        // last turnover from ranking
        if(lastblockdata && lastblockdata.height){
            let end_week_num = parseInt(lastblockdata.height / 2000)
            let limit = 25
            try{
                let jsonobj = await http_tool.json(config.ranking_api_url+"/query", {
                    action: "transfer_turnover",
                    end_week_num: end_week_num,
                    limit: limit,
                })
                // console.log(end_week_num, jsonobj)
                retdata.turnfirsthei = end_week_num * 2000
                retdata.turnover = jsonobj
                // ok
            }catch(e){
                console.log(e)
            }
        }
        // ok
        rankingShowDataCache = retdata
        rankingShowDataUphour = new Date().getHours()
    }

    // cache
    return rankingShowDataCache


}








// test
function testblocks(){
    return [{
        height: 1,
        hx: "hx1",
        prev: "hx0",
        txs: 0,
        miner: "13RnDii79yi79y",
        msg: "WoW",
        arrive: "1693149671",
    },{
        height: 2,
        hx: "hx2",
        prev: "hx1",
        txs: 0,
        miner: "13RnDii79yi79y",
        msg: "WoW",
        arrive: "1693149672",
    },{
        height: 3,
        hx: "hx3",
        prev: "hx2",
        txs: 0,
        miner: "13RnDii79yi79y",
        msg: "WoW",
        arrive: "1693149673",
    },{
        height: 4,
        hx: "hx4",
        prev: "hx3",
        txs: 0,
        miner: "13RnDii79y",
        msg: "WoW_Pool",
        arrive: "1693149674",
    },{
        height: 2,
        hx: "hx2-1",
        prev: "hx1",
        txs: 0,
        miner: "13RnDii79y",
        msg: "WoW_Pool",
        arrive: "1693149673",
    },{
        height: 4,
        hx: "hx4-1",
        prev: "hx3",
        txs: 0,
        miner: "13RnDii79y",
        msg: "WoW_Pool",
        arrive: "16931496735",
    },{
        height: 4,
        hx: "hx4-2",
        prev: "hx3",
        txs: 0,
        miner: "13RnDii79y",
        msg: "WoW_Pool",
        arrive: "16931496738",
    },{
        height: 5,
        hx: "hx5-1",
        prev: "hx4-1",
        txs: 0,
        miner: "13RnDii79y",
        msg: "WoW_Pool",
        arrive: "16931496739",
    },{
        height: 5,
        hx: "hx5",
        prev: "hx4",
        txs: 0,
        miner: "13RnDii79y",
        msg: "WoW_Pool",
        arrive: "16931496741",
    },{
        height: 6,
        hx: "hx6",
        prev: "hx5",
        txs: 0,
        miner: "18Yt6UbnDK",
        msg: "WuhanBioTech",
        arrive: "16931496746",
    },{
        height: 3,
        hx: "hx3-1",
        prev: "hx2-1",
        txs: 0,
        miner: "18Yt6UbnDK",
        msg: "WuhanBioTech",
        arrive: "1693149673",
    },{
        height: 6,
        hx: "hx6-1",
        prev: "hx5-1",
        txs: 0,
        miner: "18Yt6UbnDK",
        msg: "WuhanBioTech",
        arrive: "1693149673",
    },{
        height: 7,
        hx: "hx7-1",
        prev: "hx6-1",
        txs: 0,
        miner: "18Yt6UbnDK",
        msg: "WuhanBioTech",
        arrive: "1693149673",
    },{
        height: 8,
        hx: "hx8-1",
        prev: "hx7-1",
        txs: 0,
        miner: "18Yt6UbnDK",
        msg: "WuhanBioTech",
        arrive: "1693149673",
    },{
        height: 6,
        hx: "hx6-x",
        prev: "hx5",
        txs: 0,
        miner: "18Yt6UbnDK",
        msg: "WuhanBioTech",
        arrive: "1693149673",
    }
    ,{
        height: 1,
        hx: "hx1-x",
        prev: "hx0",
        txs: 0,
        miner: "13RnDii79yi79y",
        msg: "WoW",
        arrive: "1693149671",
    }
    ,{
        height: 1,
        hx: "hx1-y",
        prev: "hx0",
        txs: 0,
        miner: "13RnDii79yi79y",
        msg: "WoW",
        arrive: "1693149671",
    }

    ]
}
