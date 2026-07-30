const util_http = koappx.util('http');

const cnf = koappx.config();

exports.query = async function(path, params) {
    const base_url = cnf.hascan_api_url || cnf.fullnode_api_url;
    const res = await util_http.json(base_url+"/explorer/query/"+path, params||{});

    // The integrated hascan API wraps its payload in `data`; keep Explorer's
    // existing internal contract unchanged for all callers.
    if(res && res.ret === 0 && res.data && typeof res.data === 'object') {
        return Object.assign({ret: 0}, res.data);
    }
    if(res && res.ret) {
        return {ret: res.ret, err: res.error || res.err || 'hascan request failed'};
    }
    return res;
}



