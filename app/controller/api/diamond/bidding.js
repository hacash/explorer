
// /query/hashrate/logs?scale=1000&target=true


const fullnode = koappx.model('fullnode');
const datautil = koappx.util('datas');


// cache key
const ck_diabid = "diamond_bidding";

module.exports = async function(cnf, ctx){

    // check cache
    let res = ctx.cache.get(ck_diabid);
    if(res){
        ctx.apiData( res )
        return
    }

    // query from fullnode
    try {

        let lidt = await fullnode.query('diamond/bidding', {limit: 50});
        // console.log(lidt)
        res = datautil.list_to_table(lidt.list, ["name", "tx", "belong", "bid", "fee"]);
        res.number = lidt.number // latest diamond number
        // console.log(res)
        ctx.cache.set(ck_diabid, res, 5); // cache 5s
        ctx.apiData( res )

    }catch(e) {

        ctx.apiError(e)

    }
    
}
    