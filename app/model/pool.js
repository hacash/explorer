
const fullnode = require("./fullnode.js")



const wkbn = 288*7;

var latest_height= 0;
var week2blockmsgs = []; // item = "msg:adr"
var week2stats = {
    curr: {}, // 
    prev: {},
};



// load all data
setTimeout(async function(){
    const max = wkbn * 2
    let blocks = []
    try{
        for(let i=0; i<20; i++){ // 4000
            let res = await fullnode.query("block/views", {desc:true, limit: 200, page: i+1})
            for(let k in res.list){
                let one = res.list[k]
                blocks.push({msg: one.msg, miner: one.miner})
            }
        }
    }catch(e){
        return e // error
    }
    let blknum = blocks.length;
    if(!blknum){
        return // empty
    }
    // insert
    for(let i=blknum-1; i>=0; i--){
        let block = blocks[i]
        change_by_new_block(block)
    }
}, 77);


function change_by_new_block(block) {
    /*
        block = {msg: "", miner: ""}
    */
    let curr = week2stats.curr
    , prev = week2stats.prev
    , add_at = function(sec, k) {
        if(sec[k]){
            sec[k] += 1;
        }else{
            sec[k] = 1;
        }
    }
    , sub_at = function(sec, k) {
        if(sec[k] > 1){
            sec[k] -= 1;
        }else{
            delete sec[k]
        }
    }

    // do update 
    let add = `${block.msg}:${block.miner.substring(0,9)}`
    week2blockmsgs.unshift(add)
    // add to curr
    add_at(curr, add)
    // curr move to prev
    let move = week2blockmsgs[wkbn];
    if(move){
        sub_at(curr, move) // curr -1
        add_at(prev, move) // prev +1
    }
    // drop at prev
    if(week2blockmsgs.length > wkbn*2 ) {
        let drop = week2blockmsgs.pop()
        sub_at(prev, drop)
    }
}


exports.update_recent = function(blocks) {
    if(latest_height == 0){
        return // not yet
    }
    for(let i in blocks){
        let one = blocks[i];
        if(one.height == latest_height + 1){
            latest_height += 1
            change_by_new_block(one)
            break // finish
        }
    }
}


exports.get_stats = function() {
    return week2stats
}