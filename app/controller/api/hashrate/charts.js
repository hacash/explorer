
// /query/hashrate/logs?scale=1000&target=true


const fullnode = koappx.model('fullnode');


// cache key
const ck_hsrtcts = "hashrate_charts";

module.exports = async function(cnf, ctx){

    // check cache
    let res = ctx.cache.get(ck_hsrtcts);
    if(res){
        ctx.apiData( res )
        return
    }

    // query from fullnode
    try {

        res = await fullnode.query('hashrate/logs', {scale: 1000, target: true});
        // console.log(res)
        ctx.cache.set(ck_hsrtcts, res, 60*60); // cache 1hour
        ctx.apiData( res )

    }catch(e) {

        ctx.apiError(e)

    }
    
}
    