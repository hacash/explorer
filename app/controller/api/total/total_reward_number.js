/**
 * 
 */
const config = appload('config')
const http_tool = appload('tool/http')

module.exports = async function(req, res)
{
    try{
        let jsonobj = await http_tool.json(config.miner_api_url+"/query", {
            action: "totalsupply",
        })
        // ok
        // console.log(res)
        // console.log(jsonobj)
        if(jsonobj.block_reward) {
            let total = parseFloat(jsonobj.block_reward)
                + parseFloat(jsonobj.channel_interest)
            res.end(""+total)
        }else{
            res.end("22000000.0")
        }
    }catch(e){
        res.end("22000000.0")
    }
}
