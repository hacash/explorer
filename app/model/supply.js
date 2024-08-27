
const fullnode = require("./fullnode.js")

// cache key
const ck_supply = "supply";

exports.query = async function(ctx) {

    // check cache
    let res = ctx.cache.get(ck_supply);
    if(res){
        return res
    }

    // query from fullnode
    try {
        res = await fullnode.query('supply');
        // console.log(res)
        ctx.cache.set(ck_supply, res, 300); // cache 5min
        return res
    }catch(e) {
        return {ret: 1, err: e.to_string()}
    }



}