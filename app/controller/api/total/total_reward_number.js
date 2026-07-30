
const supply = koappx.model('supply');


module.exports = async function(cnf, ctx){

    let data = await supply.query(ctx);
    let total = Number(data.block_reward) + Number(data.channel_interest);
    if(data.ret || !Number.isFinite(total)) {
        ctx.res.statusCode = 503;
        ctx.res.end('');
        return;
    }

    ctx.res.end(total+'')
    
}
