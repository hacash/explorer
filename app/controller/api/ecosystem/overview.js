const ecosystem = koappx.model('ecosystem');

module.exports = async function(cnf, ctx){
    try {
        const data = await ecosystem.query(ctx);
        if(data.ret) {
            ctx.apiError(data.err);
            return;
        }
        ctx.apiData(data);
    }catch(e) {
        ctx.apiError(e);
    }
}
