const fs = require("fs")
const fullnode = require("./fullnode.js")
const pool = require("./pool.js")



////////////////////////////////////////////////


let blockdatacache_maps = {} // 
let recentblockscahce = [] // 

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



////////////////////////////////////////////////



async function queryRecentBlocks() {
    var blocks = []
    try{
        // console.log("await http_tool.json(config.miner_api_url", "end_height:", last, "start_height:", start_height, "limit:", last-start_height+1)
        let jsonobj = await fullnode.query("block/recents", {})
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

    pool.update_recent(blocks); // update pool stats

    for(let i in blocks) {
        let li = blocks[i];
        blocks[i].msg = li.message
        blocks[i].miner = li.miner.substring(0, 9)+'...'
        blocks[i].hx = li.hash.substring(26, 32)
        blocks[i].prev = li.prev.substring(26, 32)
        delete blocks[i].time
        delete blocks[i].txs
        delete blocks[i].reward
        delete blocks[i].message
        delete blocks[i].hash
    }

    // test
    // blocks = testblocks();

    // clear cache
    recentblockscahce = []

    // insert
    function havchilds(list, blk) {
        if(!list) return false
        for(var i in list) {
            if(list[i].hx== blk.hx){
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
   
    // save fork log
    storeBlockForksLog(recentblockscahce)

    // if(!not_clean_cache) {
    //     setTimeout(function(){
    //         recentblockscahce = []
    //     }, 1000*77)
    // }

    return recentblockscahce
}

setInterval(queryRecentBlocks, 1000*17)


exports.get_recent_blocks = async function(clean_cache){
    if(clean_cache){
        recentblockscahce = [] // 清除缓存
    }
    if(recentblockscahce.length){
        return recentblockscahce // 返回缓存
    }
    return await queryRecentBlocks()
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
