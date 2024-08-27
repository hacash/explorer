
const supply = koappx.model('supply');


module.exports = async function(cnf, ctx){

    ctx.apiData( await supply.query(ctx) )
    
}
    