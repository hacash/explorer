const fullnode = require("./fullnode.js")

const cache_key = "block_pool_stats_v2";
const cache_ttl = 60;
let pending_query = null;

exports.query = async function(ctx) {
    let res = ctx.cache.get(cache_key);
    if(res) {
        return res;
    }

    if(!pending_query) {
        pending_query = fullnode.query("block/pools");
    }
    try {
        res = await pending_query;
        if(res && res.ret === 0) {
            ctx.cache.set(cache_key, res, cache_ttl);
        }
        return res;
    } finally {
        pending_query = null;
    }
}
