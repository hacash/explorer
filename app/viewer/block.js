

const fullnode = koappx.model('fullnode');

const number = koappx.util('number');



    
exports.components = [
    'html',
    'header',

    'block',

    'footer',
    'tail',
]


exports.datas = async function(cnf, ctx)
{

    /*for(let i=519240; ;i++) {
        if(i%1000 == 0){
            console.log(i)
        }
        let data = await fullnode.query('diamond/engrave', {height: i, tx_hash: true});
        let l = data.list.length;
        if(l==0){
            continue
        }
        //
        console.log(i, data.list)
    }*/
    
    // 
    let blkid = ctx.params.blkid;
    // params
    let qps = {
        tx_hash_list: true,
    }
    if(blkid.length == 64) {
        qps.hash = blkid
    }else{
        qps.height = blkid
    }

    let block_intro = await fullnode.query('block/intro', qps);
    if(!block_intro || !block_intro.height) {
        block_intro = null // not find
    }

    let pdata = {
        blkid: blkid,
        title: blkid + " - Block",
        toThousands: number.toThousands,
        block_intro: block_intro,
    }

    return pdata;
}

    