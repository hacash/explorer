
const supply = koappx.model('supply');


module.exports = async function(cnf, ctx){

    let data = await supply.query(ctx);
    let md = data.minted_diamond;
    if(data.ret || md === undefined) {
        ctx.res.statusCode = 503;
        ctx.res.end('');
        return;
    }

    ctx.res.end(md+'')

}
