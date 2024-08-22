
// /query/hashrate/logs?scale=1000&target=true


const block = koappx.model('block');


module.exports = async function(cnf, ctx){

    try {
        let res = await block.get_recent_blocks();
        ctx.apiData( {ret: 0, list: res} )
    }catch(e) {
        ctx.apiError(e)
    }
    
}
    