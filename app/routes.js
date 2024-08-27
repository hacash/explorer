module.exports = {

    // page view
    '/': 'VIEW:index',
    '/address/:addr': 'VIEW:address',
    '/block/:blkid': 'VIEW:block',
    '/tx/:hx': 'VIEW:tx',
    '/diamond/:diaid': 'VIEW:diamond',
    '/channel/:chid': 'VIEW:channel',
    '/diamond-views/:page': 'VIEW:diaviews',
    '/diamond-views': 'VIEW:diaviews',
    


    // api
    '/api/account/balance': 'api/account/balance',
    //
    '/api/total/supply': 'api/total/supply',
    '/api/hashrate/charts': 'api/hashrate/charts',
    '/api/diamond/bidding': 'api/diamond/bidding',
    '/api/diamond/views': 'api/diamond/views',
    '/api/block/recents': 'api/block/recents',
    '/api/block/views': 'api/block/views',
    '/api/block/pools': 'api/block/pools',
    // 'POST:/api/data/save': 'api/data/save',
    '/api/ranking/active': 'api/ranking/active',
    '/api/ranking/top100': 'api/ranking/top100',
    //
    '/api/actlogs/cointrs': 'api/actlogs/cointrs',
    '/api/actlogs/fiopts': 'api/actlogs/fiopts',

    // raw data
    '/api/total/current_circulation_number': 'api/total/current_circulation_number',
    '/api/total/hacd_circulation_number': 'api/total/hacd_circulation_number',
    '/api/total/total_reward_number': 'api/total/total_reward_number',

}
    