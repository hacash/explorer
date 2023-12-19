/**
 * 
 */

const http_tool = appload('tool/http')
const config = appload('config')
const module_diamondcount = appload('model/diamondcount')


exports.components = [
    'header',

    'address',

    'footer',
]



exports.datas = async function(query, callback, req, res)
{
    // console.log(query)
    // console.log(req.params)
    let addr = req.params.address 
    // 查询余额
    let hacash = "ㄜ0:0"
    let satoshi = "0"
    let diamond = "0"
    try{
        let jsonobj = await http_tool.json(config.miner_api_url+"/query", {
            action: "balance",
            address: addr,
        })
        // let datas = jsonobj.datas
        // console.log(jsonobj)
        hacash = jsonobj.total
        satoshi = jsonobj.satoshi
        diamond = jsonobj.diamond
    }catch(e){
        console.log(e)
        amount = "[error]"
    }
    // 查询钻石数量
    let diamondcount = await module_diamondcount.getCount( addr )

    // 返回
    callback(null, {
        pagetitle: "Hacash Address " + req.params.address,
        address: req.params.address,
        hacash_amount: hacash,
        satoshi_amount: satoshi,
        diamond_amount: diamond,
        diamond_mined: diamondcount,
        ranking_api_url: config.ranking_api_url,
    }, req, res)
}



