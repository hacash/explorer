
const supply = koappx.model('supply');


module.exports = async function(cnf, ctx){

    let data = await supply.query(ctx);
    if(data.ret) {
        ctx.apiError(data.err);
        return;
    }
    ctx.apiData(data)

}
