/**
 * 
 */
const config = appload('config')
const http_tool = appload('tool/http')
const api = appload('tool/apiRespond')

var cacheDataRanking = {}

module.exports = async function(req, res)
{
    var kind = req.query.kind
      , cache = cacheDataRanking[kind]
      , cht = 60*30
      , cts =  parseInt((new Date()).getTime() / 1000)
        // console.log("缓存", cache, cts)
    if(cache && cache.time + cht > cts){
        // console.log(kind, "使用缓存")
        api.success(res, cache.data)
        return // 使用缓存
    }
    // 读取接口
    try{
        let jsonobj = await http_tool.json(config.ranking_api_url+"/query", {
            action: "ranking",
            kind: kind,
        })
        // 缓存
        cacheDataRanking[kind] = {
            time: cts,
            data: jsonobj,
        }
        // ok
        api.success(res, jsonobj)
    }catch(e){
        api.error(res,  e)
    }
}
