


const config = appload('config')
const http_tool = appload('tool/http')
const api = appload('tool/apiRespond')


module.exports = async function(req, res)
{
    let q = req.query
    , addr = q.address
    , params = {
        action: "balance",
        address: addr,
    }
    if(q.unitmei) {
        params.unitmei = true
    }

    try{
        let jsonobj = await http_tool.json(config.miner_api_url+"/query", params)
        console.log(jsonobj)
        api.success(res, {
            hacash: jsonobj.total,
            satoshi: jsonobj.satoshi,
            diamond: jsonobj.diamond,
        });
    }catch(e){
        api.error(res, e.toString())
    }
}