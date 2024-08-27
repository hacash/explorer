

const fullnode = koappx.model('fullnode');

const number = koappx.util('number');



    
exports.components = [
    'html',
    'header',

    'tx',

    'footer',
    'tail',
]


exports.datas = async function(cnf, ctx)
{
    // 
    let hx = ctx.params.hx;
    // params
    let qps = {
        hash: hx,
        actions: true,
    }
    let txdesc = await fullnode.query('transaction/desc', qps);
    // console.log(txdesc)
    if(!txdesc || !txdesc.block) {
        txdesc = null // not find
    }

    let pdata = {
        hx: hx,
        title: hx + " - Tx",
        toThousands: number.toThousands,
        trsinfo: txdesc,
    }

    return pdata;
}

    