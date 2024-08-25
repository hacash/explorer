

const hascan = koappx.model('hascan');



// cache key
const ck_tlcoinpg1 = "txlog_coin_page1_limit";


module.exports = async function(cnf, ctx){


    let q = ctx.query || {};
    let limit = q.limit || 20;
    let chkey = ck_tlcoinpg1 + limit;

    if(q.page1) {
        let res = ctx.cache.get(chkey);
        if(res){
            ctx.apiData( res )
            return
        }
        try {
            let res = await hascan.query('coin/transfer', {limit});
            // console.log(res)
            ctx.cache.set(chkey, res, 66); // cache 66s
            ctx.apiData( res )
        }catch(e) {
            ctx.apiError(e)
        }
        return
    }


    // load another page

    let params = {
        limit,
        from: q.from||undefined,
        to: q.to||undefined,
        both: q.both||undefined,
        page: q.page||undefined,
    };
    try {
        let res = await hascan.query('coin/transfer', params);
        // console.log(res, params)
        ctx.apiData( res )
    }catch(e) {
        ctx.apiError(e)
    }
    
}
    




