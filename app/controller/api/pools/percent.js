
const pools = appload('model/pools');
const api = appload('tool/apiRespond')

var pool_stats_data_cache = {};

module.exports = async function(req, res)
{
    var cache = pool_stats_data_cache
      , cht = 60*4
      , cts =  parseInt((new Date()).getTime() / 1000)
    if(cache && cache.time && cache.time + cht > cts){
        api.success(res, cache)
        return // use cache
    }

    try{
        pool_stats_data_cache = await pools.get_stats()
        pool_stats_data_cache.time = cts
        // ok
        api.success(res, pool_stats_data_cache)
    }catch(e){
        console.log(e)
        api.error(res, e)
    }

}