
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
    let blkobj = await fullnode.query('balance', {address});
    let cntobj = await hascan.query('address/count', {address});
    let have1 = blkobj && blkobj.list && blkobj.list.length;
    let have2 = cntobj && cntobj.list && cntobj.list.length;

    let pdata = {
        address,
        title: address+ " - Address",
        toThousands: number.toThousands,
        bls: have1 ? blkobj.list[0] : {},
        cnt: have2 ? cntobj.list[0] : {},
    }
    // console.log(pdata)

    return pdata;
}

    