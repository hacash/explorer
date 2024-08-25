
const hascan = koappx.model('hascan');


// cache key
const ck_rktop = "rk_top_100_";

module.exports = async function(cnf, ctx){

    let q = ctx.query || {};
    if(q.coin!="HAC" && q.coin!="BTC" && q.coin!="HACD"){
        ctx.apiError("param coin error")
        return
    }

    let chkey = ck_rktop + q.coin
    // check cache
    let res = ctx.cache.get(chkey);
    if(res){
        ctx.apiData( res )
        return
    }

    // query from hascan
    try {

        res = await hascan.query('ranking/top100', {coin: q.coin});
        // console.log(res)
        ctx.cache.set(chkey, res, 330); // cache 5min
        ctx.apiData( res )

    }catch(e) {

        ctx.apiError(e)

    }
    
}
    