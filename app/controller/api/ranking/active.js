
const hascan = koappx.model('hascan');


// cache key
const ck_rkactive = "chain_active";

module.exports = async function(cnf, ctx){

    // check cache
    let res = ctx.cache.get(ck_rkactive);
    if(res){
        ctx.apiData( res )
        return
    }
    
    // query from hascan
    try {

        res = await hascan.query('chain/active', {});
        // console.log(res)
        ctx.cache.set(ck_rkactive, res, 379); // cache 5min
        ctx.apiData( res )

    }catch(e) {

        ctx.apiError(e)

    }
    
}
    