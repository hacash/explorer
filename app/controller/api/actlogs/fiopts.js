

const hascan = koappx.model('hascan');


module.exports = async function(cnf, ctx){


    let q = ctx.query || {};
    let limit = q.limit || 20;

    // load another page

    let params = {
        limit,
        page: q.page||undefined,
        both: q.both||undefined,
    };
    try {
        let res = await hascan.query('defi/operate', params);
        // console.log(res, params)
        ctx.apiData( res )
    }catch(e) {
        ctx.apiError(e)
    }
    
}
    




