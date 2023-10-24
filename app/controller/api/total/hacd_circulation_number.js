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
        if(jsonobj.minted_diamond) {
            res.end(""+jsonobj.minted_diamond)
        }else{
            res.end("16777216")
        }
    }catch(e){
        res.end("16777216")
    }
}
