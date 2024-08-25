
// /query/hashrate/logs?scale=1000&target=true


const fullnode = koappx.model('fullnode');
const datautil = koappx.util('datas');


// cache key
const ck_allblkpg1 = "block_all_page1_limit";
const ret_table_keys = ["height", "hash", "msg", "reward", "miner", "time", "txs"];

module.exports = async function(cnf, ctx){

    let q = ctx.query || {};
    let limit = q.limit || 50;

    if(!q.page1) {

        try {
            let lidt = await fullnode.query('block/views', {
                limit: limit, 
                page: q.page||1, 
                desc: q.desc||false,
            });
            let res = datautil.list_to_table(lidt.list, ret_table_keys);
            ctx.apiData( res )
    
        }catch(e) {
            ctx.apiError(e)

        }
        return
    }


    // load page1

    // check cache
    let ccku = ck_allblkpg1 + limit
    let res = ctx.cache.get(ccku);
    if(res){
        ctx.apiData( res )
        return
    }
    try {
        let lidt = await fullnode.query('block/views', {limit: limit, desc: true});
        // console.log(lidt)
        res = datautil.list_to_table(lidt.list, ret_table_keys);
        // console.log(res)
        ctx.cache.set(ccku, res, 45); // cache 45s
        ctx.apiData( res )

    }catch(e) {

        ctx.apiError(e)

    }
    
}
    