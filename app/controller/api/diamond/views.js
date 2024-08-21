
// /query/hashrate/logs?scale=1000&target=true


const fullnode = koappx.model('fullnode');
const datautil = koappx.util('datas');


// cache key
const ck_diapic6 = "diamond_views_latest6";
const ret_table_keys = ["name", "number", "life_gene", "bid_fee"];

module.exports = async function(cnf, ctx){

    let q = ctx.query || {};

    if(!q.latest6) {

        try {
            let lidt = await fullnode.query('diamond/views', {
                limit: q.limit||50, 
                page: q.page||1, 
                desc: q.desc||false,
            });
            res = datautil.list_to_table(lidt.list, ret_table_keys);
            ctx.apiData( res )
    
        }catch(e) {
            ctx.apiError(e)

        }
        return
    }


    // load latest6

    // check cache
    let res = ctx.cache.get(ck_diapic6);
    if(res){
        ctx.apiData( res )
        return
    }
    try {
        let lidt = await fullnode.query('diamond/views', {limit: 6, desc: true});
        // console.log(lidt)
        res = datautil.list_to_table(lidt.list, ret_table_keys);
        // console.log(res)
        ctx.cache.set(ck_diapic6, res, 200); // cache 200s
        ctx.apiData( res )

    }catch(e) {

        ctx.apiError(e)

    }
    
}
    