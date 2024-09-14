

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
        action: true,
    }
    let txdesc = await fullnode.query('transaction', qps);
    // console.log(txdesc)
    if(!txdesc || !txdesc.block) {
        txdesc = null // not find
    }

    let pdata = {
        hx: hx,
        title: hx + " - Tx",
        toThousands: number.toThousands,
        trsinfo: txdesc,
        splitdias(ds) {
            let res = [];
            for(let i=0;i<ds.length; i+=6) {
                res.push(ds.substring(i, i+6))
            }
            return res.join(', ')
        }
    }

    return pdata;
}

    