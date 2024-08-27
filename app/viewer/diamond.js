

const fullnode = koappx.model('fullnode');

const number = koappx.util('number');



    
exports.components = [
    'html',
    'header',

    'diamond',

    'footer',
    'tail',
]


exports.datas = async function(cnf, ctx)
{
    // 
    let diaid = ctx.params.diaid;
    // params
    let qps = {}
    if(parseInt(diaid) > 0){
        qps.number = parseInt(diaid)
    }else{
        qps.name = diaid
    }
    let diaobj = await fullnode.query('diamond', qps);
    // console.log(diaobj)
    if(!diaobj || !diaobj.name) {
        diaobj = null // not find
    }

    let pdata = {
        diaid: diaid,
        title: diaid + " - Diamond",
        toThousands: number.toThousands,
        diamond: diaobj,
    }

    return pdata;
}

    