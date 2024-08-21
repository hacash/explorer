
const fullnode = koappx.model('fullnode');




module.exports = async function(cnf, ctx){

    try {

        let res = await fullnode.query('supply');
        // console.log(res)
        ctx.apiData( res )

    }catch(e) {

        ctx.apiError(e)

    }
    
}
    