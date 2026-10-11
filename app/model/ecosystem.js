const supply = koappx.model('supply');
const hascan = koappx.model('hascan');

const cacheKey = 'istanbul_ecosystem_overview_v1';
const cacheTtl = 120;
let pendingQuery = null;

exports.query = async function(ctx) {
    const cached = ctx.cache.get(cacheKey);
    if(cached) {
        return cached;
    }
    if(!pendingQuery) {
        // hascan-only routes degrade to empty sets when the node has no
        // indexer attached (e.g. the defi localnet testnet fullnode).
        const safe = q => q.catch(e => {
            console.log('[ecosystem] indexer unavailable, empty fallback:', e && e.message || e)
            return { ret: 0, addrs: {}, list: [] }
        })
        pendingQuery = Promise.all([
            supply.query(ctx),
            safe(hascan.query('ecosystem/assets', {limit: 5})),
            safe(hascan.query('ecosystem/contracts', {limit: 5})),
        ]).then(function(results){
            const [supplyData, assets, contracts] = results;
            if(supplyData.ret) {
                return supplyData;
            }
            if(assets.ret) {
                return assets;
            }
            if(contracts.ret) {
                return contracts;
            }
            return {
                ret: 0,
                supply: supplyData,
                assets: assets,
                contracts: contracts,
            };
        });
    }
    try {
        const result = await pendingQuery;
        if(result.ret === 0) {
            ctx.cache.set(cacheKey, result, cacheTtl);
        }
        return result;
    } finally {
        pendingQuery = null;
    }
}
