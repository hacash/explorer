
const fullnode = koappx.model('fullnode');
const hascan = koappx.model('hascan');

const number = koappx.util('number');



    
exports.components = [
    'html',
    'header',

    'address',

    'footer',
    'tail',
]


exports.datas = async function(cnf, ctx)
{

    let address = ctx.params.addr;
    let cntobj = await hascan.query('address/count', {address});
    let blkobj = await fullnode.query('balance', {address});

    let pdata = {
        address,
        title: address+ " - Address",
        toThousands: number.toThousands,
        bls: blkobj.list[0] || {},
        cnt: cntobj.list[0] || {},
    }
    // console.log(pdata)

    return pdata;
}

    