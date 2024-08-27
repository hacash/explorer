

const fullnode = koappx.model('fullnode');

const number = koappx.util('number');



    
exports.components = [
    'html',
    'header',

    'channel',

    'footer',
    'tail',
]


exports.datas = async function(cnf, ctx)
{
    // 
    let chid = ctx.params.chid;
    // params
    let qps = {
        id: chid
    }
    let chobj = await fullnode.query('channel', qps);
    // console.log(diaobj)
    if(!chobj || !chobj.id) {
        chobj = null // not find
    }

    let pdata = {
        chid: chid,
        title: chid + " - Channel",
        toThousands: number.toThousands,
        channel: chobj,
    }

    return pdata;
}

    