
const supply = koappx.model('supply');


module.exports = async function(cnf, ctx){

    let data = await supply.query(ctx);
    let md = data.minted_diamond;
    let item = md ? (md + '') : '16777216';

    ctx.res.end( item+'' )
    
}
    