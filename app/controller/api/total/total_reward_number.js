
const supply = koappx.model('supply');


module.exports = async function(cnf, ctx){

    let data = await supply.query(ctx);
    let total = '22000000.0';
    if(data.block_reward) {
        total = parseFloat(data.block_reward) + parseFloat(data.channel_interest)
    }
    
    ctx.res.end( total+'' )
    
}
    