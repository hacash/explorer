
const supply = koappx.model('supply');


module.exports = async function(cnf, ctx){

    let data = await supply.query(ctx);
    let cc = data.current_circulation;
    let item = cc ? (cc + '') : '22000000.0';

    ctx.res.end( item + '' )
    
}
    