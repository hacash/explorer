

const fullnode = koappx.model('fullnode');

const number = koappx.util('number');


function addrfmt(v, main_address) {
    if(!v) {
        return main_address || ''
    }
    if(typeof v === 'string') {
        return v
    }
    if(typeof v === 'object') {
        if(typeof v.address === 'string') {
            return v.address
        }
        if(v.type == 1 && typeof v.value === 'string') {
            return v.value
        }
    }
    return main_address || ''
}

function diamondCount(diamonds) {
    let dms = (diamonds || '') + ''
    dms = dms.replace(/[^WTYUIAHXVMEKBSZN]/ig, '')
    return parseInt(dms.length / 6)
}

function normalizeAction(one, main_address) {
    let act = Object.assign({}, one || {})
    let k = parseInt(act.kind || 0)

    if(k == 1) {
        act.from = main_address
        act.to = addrfmt(act.to, main_address)
    }else if(k == 13) {
        act.from = addrfmt(act.from, main_address)
        act.to = main_address
    }else if(k == 14) {
        act.from = addrfmt(act.from, main_address)
        act.to = addrfmt(act.to, main_address)
    }else if(k == 10) {
        act.from = main_address
        act.to = addrfmt(act.to, main_address)
    }else if(k == 11) {
        act.from = addrfmt(act.from, main_address)
        act.to = main_address
    }else if(k == 12) {
        act.from = addrfmt(act.from, main_address)
        act.to = addrfmt(act.to, main_address)
    }else if(k == 5) {
        act.from = main_address
        act.to = addrfmt(act.to, main_address)
        act.diamonds = act.diamonds || act.diamond || ''
        act.diamond = 1
    }else if(k == 6 || k == 7 || k == 8) {
        if(k == 6) {
            act.from = addrfmt(act.from, main_address)
            act.to = addrfmt(act.to, main_address)
        }else if(k == 7) {
            act.from = main_address
            act.to = addrfmt(act.to, main_address)
        }else{
            act.from = addrfmt(act.from, main_address)
            act.to = main_address
        }
        act.diamonds = act.diamonds || ''
        act.diamond = act.diamond || diamondCount(act.diamonds)
    }else if(k == 2) {
        if(act.left_bill) {
            act.left_addr = act.left_addr || addrfmt(act.left_bill.address, '')
            act.left_amt = act.left_amt || act.left_bill.amount || ''
        }
        if(act.right_bill) {
            act.right_addr = act.right_addr || addrfmt(act.right_bill.address, '')
            act.right_amt = act.right_amt || act.right_bill.amount || ''
        }
    }else if(k == 4) {
        if(act.d) {
            act.name = act.name || act.d.diamond
            act.miner = act.miner || act.d.address
        }
    }else if(k == 22 || k == 23 || k == 24 || k == 27) {
        if(!act.assert_address && act.assert_bill) {
            act.assert_address = addrfmt(act.assert_bill.address, '')
        }
        if(!act.bill_number && act.assert_bill_auto_number != undefined) {
            act.bill_number = act.assert_bill_auto_number
        }
    }else if(k == 29) {
        act.start_height = act.start_height || act.start
        act.end_height = act.end_height || act.end
    }

    return act
}

function normalizeTxDesc(txdesc) {
    if(!txdesc) {
        return null
    }
    let out = Object.assign({}, txdesc)
    let main_address = out.main_address || ''
    if(out.pending && !out.block) {
        out.block = {
            height: 0,
            timestamp: out.timestamp || 0,
        }
    }
    out.actions = (out.actions || []).map(one => normalizeAction(one, main_address))
    return out
}



    
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
    if(!txdesc || (!txdesc.block && !txdesc.pending)) {
        txdesc = null // not find
    }else{
        txdesc = normalizeTxDesc(txdesc)
    }

    let pdata = {
        hx: hx,
        title: hx + " - Tx",
        toThousands: number.toThousands,
        trsinfo: txdesc,
        splitdias(ds) {
            ds = (ds || '') + ''
            let res = [];
            for(let i=0;i<ds.length; i+=6) {
                res.push(ds.substring(i, i+6))
            }
            return res.join(', ')
        }
    }

    return pdata;
}

    
