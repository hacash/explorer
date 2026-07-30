
const supply = koappx.model('supply');


module.exports = async function(cnf, ctx){

    let data = await supply.query(ctx);
    let cc = data.current_circulation;
    if(data.ret || cc === undefined) {
        ctx.res.statusCode = 503;
        ctx.res.end('');
        return;
    }

    ctx.res.end(cc + '')

}
