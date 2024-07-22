const fs = require("fs")

const config = appload('config')
const http_tool = appload('tool/http')
const model_block = appload('model/block')


let mmsfp = appabs("datas/miner_msg_stats.dat")

let miner_msg_stats = {}
function save_miner_msg_stats_data() {
    var fcon = new Uint8Array(Buffer.from(JSON.stringify(miner_msg_stats)))
    fs.writeFileSync(mmsfp, fcon)
}

if( ! fs.existsSync(mmsfp) ){
    miner_msg_is_first_load = true;
    (async function(){
        let lasthei = (await model_block.getLastBlock()).height
        // two weeks
        miner_msg_stats = {"height":lasthei-1,"last_week":{},"prev_week":{}}
        let lastw = miner_msg_stats["last_week"]
        let prevw = miner_msg_stats["prev_week"]
        for(var hei=lasthei-(288*14); hei<lasthei-(288*7);hei++) {
            let msgobj = await load_miner_msg_stats_from_node(hei, 1)
            add_or_drop_miner_msg('add', msgobj.datas[0], "prev_week")
        }
        for(var hei=lasthei-(288*7); hei<lasthei;hei++) {
            let msgobj = await load_miner_msg_stats_from_node(hei, 1)
            add_or_drop_miner_msg('add', msgobj.datas[0], "last_week")
        }
        save_miner_msg_stats_data()
    })().then();
}else{
    miner_msg_stats = JSON.parse(fs.readFileSync(mmsfp, {encoding:'utf8'}))
}

// console.log(miner_msg_stats)


exports.get_stats = async function() {
    let lasthei = (await model_block.getLastBlock()).height
    let updthei = miner_msg_stats.height
    // console.log(updthei, lasthei)
    if(updthei == lasthei) {
        // no need update data
        return miner_msg_stats
    }
    // update
    for(var hei=updthei; hei<=lasthei; hei++) {
        let msgobj = await load_miner_msg_stats_from_node(hei)
        // console.log(msgobj)
        let d1 = msgobj.datas[0]
        let d2 = msgobj.datas[1]
        let d3 = msgobj.datas[2]
        add_or_drop_miner_msg('add', d1, "last_week")
        add_or_drop_miner_msg('sub', d2, "last_week")
        add_or_drop_miner_msg('add', d2, "prev_week")
        add_or_drop_miner_msg('sub', d3, "prev_week")
    }

    // console.log(miner_msg_stats)
    miner_msg_stats.height = lasthei
    save_miner_msg_stats_data()
    return miner_msg_stats
}


function add_or_drop_miner_msg(add, dt, key) {
    var is_add = add==='add' ? true : false
    var nk = dt.msg + ':' + dt.adr.substring(0, 9)
    if(!dt.msg || dt.msg=='unknown') {
        nk = 'unknown:'
    }
    var sto = miner_msg_stats[key]
    if(is_add) {
        if(sto[nk]) {
            sto[nk] += 1
        }else{
            sto[nk] = 1
        }
    }else{

        if(sto[nk]) {
            if(sto[nk] <= 1) {
                delete sto[nk]
            }else{
                sto[nk] -= 1
            }
        }
    }
}

async function load_miner_msg_stats_from_node(hei, limit) {

    let jsonobj = await http_tool.json(config.miner_api_url+"/query", {
        action: "minermsgstats",
        last_height: hei,
        step_num: 288*7,
        limit: limit||3,
    })

    return jsonobj
}




