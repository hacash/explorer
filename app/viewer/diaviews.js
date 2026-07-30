

const fullnode = koappx.model('fullnode');
const datautil = koappx.util('datas');
const number = koappx.util('number');



exports.components = [
    'html',
    'header',

    'diaviews',

    'footer',
    'tail',
]


exports.datas = async function(cnf, ctx)
{
    let q = ctx.query || {};
    let dianames = q.name || ''
    let page = parseInt((ctx.params||{}).page || q.page || 1);
    let limit = parseInt(q.limit || 200);
    page = Number.isSafeInteger(page) && page > 0 ? page : 1;
    limit = Number.isSafeInteger(limit) && limit > 0 ? Math.min(limit, 200) : 200;
    let params = {
        limit, page, desc: true,
    }
    if(dianames.length >= 6){
        params.name = dianames
    }

    // query
    let res = await fullnode.query('diamond/views', params);
    let latest_number = res.latest_number;
    // console.log(res);
    // res = datautil.list_to_table(lidt.list, ret_table_keys);

    let pdata = {
        dvhip: ctx.cookies.get("dvhip")||undefined,
        title: "Diamond View",
        toThousands: number.toThousands,
        show_fee: !q.no_fee,
        show_info: !q.no_info,
        p: {
            page: page,
            limit: limit,
            maxpage: dianames.length >= 6 ? 1 : Math.max(1, Math.ceil(latest_number / limit)),
        },
        curdianum: latest_number,
        dianames: dianames,
        diamonds: res.list,
    }

    return pdata;
}
