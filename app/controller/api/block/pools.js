
const pool = koappx.model('pool');


module.exports = async function(cnf, ctx){
    let res = pool.get_stats();
    ctx.apiData( res )
}
    