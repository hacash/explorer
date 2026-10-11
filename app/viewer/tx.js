

const fullnode = koappx.model('fullnode');

const number = koappx.util('number');


function escapeHtml(v) {
    return (v === undefined || v === null ? '' : v + '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}


// Address / diamond printable helpers ------------------------------------

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

// AddrOrPtr on the wire: string address, or a bare number meaning a
// pointer into the transaction address table — honest label, not main addr.
function addrptrfmt(v, main_address) {
    if(typeof v === 'number') {
        return { ptr: v }
    }
    let a = addrfmt(v, '')
    if(!a) {
        return { main: true, addr: main_address || '' } // omitted endpoint = main address
    }
    return { addr: a }
}

function diamondCount(diamonds) {
    let dms = (diamonds || '') + ''
    dms = dms.replace(/[^WTYUIAHXVMEKBSZN]/ig, '')
    return parseInt(dms.length / 6)
}

// "0x6162" -> printable "ab"; unreadable bytes stay as 0x hex (truncated)
function bytesReadable(v, maxhex) {
    if(v === undefined || v === null) return ''
    let s = (typeof v === 'string') ? v : (v + '')
    if(s.indexOf('0x') != 0 && s.indexOf('0X') != 0) return s
    let hex = s.substring(2)
    if(hex.length % 2 != 0) return s
    let printable = true
    let out = ''
    for(let i = 0; i < hex.length; i += 2) {
        let c = parseInt(hex.substr(i, 2), 16)
        if(c == 0x0a || c == 0x09 || (c >= 0x20 && c <= 0x7e)) {
            out += String.fromCharCode(c)
        }else {
            printable = false
            break
        }
    }
    if(printable) return out
    let limit = (maxhex || 64) * 2
    return '0x' + (hex.length > limit ? hex.substring(0, limit) + '…' : hex)
}

function hexBytesLen(v) {
    let s = (v || '') + ''
    if(s.indexOf('0x') != 0 && s.indexOf('0X') != 0) return 0
    return parseInt((s.length - 2) / 2)
}

function toThousandsStr(v) {
    try {
        return number.toThousands(v)
    }catch(e) {
        return v + ''
    }
}


// Display field builders ---------------------------------------------------
// field = { lk: lang key suffix, lt: plain label fallback, t: type, ... }
//   t: addr | ptraddr | dias | amt | num | str | hx | chn | lnk | ast

function fld(lk, t, v, opt) {
    return Object.assign({ lk, lt: lk, t, v }, opt || {})
}

function addrField(lk, v, main_address) {
    let p = addrptrfmt(v, main_address)
    if(p.ptr !== undefined) {
        return fld(lk, 'str', '#' + p.ptr)
    }
    if(p.main) {
        return fld(lk, 'main', '')
    }
    return fld(lk, 'addr', p.addr)
}

function diamondsField(lk, names) {
    let list = (names || '') + ''
    list = list.trim()
    if(!list) return fld(lk, 'str', '')
    return fld(lk, 'dias', list)
}

function amtField(lk, v, unit) {
    return fld(lk, 'amt', v, { unit: unit || '' })
}

function numField(lk, v, unit) {
    return fld(lk, 'num', toThousandsStr(v) + (unit ? ' ' + unit : ''))
}


// action kind registry ------------------------------------------------------

const ACT_NAMES = {
    1: 'act_hac_trs', 13: 'act_hac_trs', 14: 'act_hac_trs',
    10: 'act_sat_trs', 11: 'act_sat_trs', 12: 'act_sat_trs',
    17: 'act_asset_trs', 18: 'act_asset_trs', 19: 'act_asset_trs',
    5: 'act_transfer_diamond', 6: 'act_transfer_diamond',
    7: 'act_transfer_diamond', 8: 'act_transfer_diamond',
    2: 'act_open_channel', 3: 'act_close_channel',
    4: 'act_mining_diamond',
    16: 'act_asset_create',
    22: 'act_tex_exec',
    25: 'act_ast_select', 26: 'act_ast_if',
    32: 'act_insc_push', 33: 'act_insc_clean', 34: 'act_insc_edit',
    35: 'act_insc_move', 36: 'act_insc_drop',
    40: 'act_contract_deploy', 41: 'act_contract_update',
    44: 'act_contract_maincall', 46: 'act_p2sh_prove',
    0x0401: 'act_message', 0x0402: 'act_blob',
    0x0411: 'act_chain_allow', 0x0412: 'act_height_scope',
    0x0413: 'act_balance_floor', 0x0414: 'act_required_signers',
    // legacy (pre-Istanbul mainnet) kinds
    9: 'act_lockbls_create', 15: 'act_lockbls_create',
    20: 'act_height_limit', 29: 'act_height_limit',
    30: 'act_chain_id', 23: 'act_chanassert', 24: 'act_chanassert',
    27: 'act_chanassert',
}

const TEX_CELLS = {
    1: ['ZhuPay', '支付 HAC'], 2: ['ZhuGet', '获得 HAC'],
    3: ['SatPay', '支付 SAT'], 4: ['SatGet', '获得 SAT'],
    5: ['DiaPay', '支付 HACD'], 6: ['DiaGet', '获得 HACD'],
    7: ['AssetPay', '支付资产'], 8: ['AssetGet', '获得资产'],
    11: ['CondZhuAtMost', 'HAC ≤'], 12: ['CondZhuAtLeast', 'HAC ≥'],
    13: ['CondZhuEq', 'HAC ='], 14: ['CondSatAtMost', 'SAT ≤'],
    15: ['CondSatAtLeast', 'SAT ≥'], 16: ['CondSatEq', 'SAT ='],
    17: ['CondDiaAtMost', 'HACD ≤'], 18: ['CondDiaAtLeast', 'HACD ≥'],
    19: ['CondDiaEq', 'HACD ='],
    20: ['CondAssetAtMost', '资产 ≤'], 21: ['CondAssetAtLeast', '资产 ≥'],
    22: ['CondAssetEq', '资产 ='],
    23: ['CondHeightAtMost', '高度 ≤'], 24: ['CondHeightAtLeast', '高度 ≥'],
    25: ['CondChainIdEq', '链ID ='],
}


function assetAmtText(ast) {
    if(!ast || typeof ast != 'object') return ''
    return '#' + ast.serial + ' × ' + toThousandsStr(ast.amount)
}

// build display structure for one action
function buildDisplay(one, main_address, trsinfo, depth) {
    depth = depth || 0
    let act = one
    let k = parseInt(act.kind || 0)
    let dsp = {
        kind: k,
        name: ACT_NAMES[k] || '',
        fields: [],
        children: null,
        desc: act.description || '',
    }

    let F = dsp.fields

    // ---- HAC transfers (1/13/14) ----
    if(k == 1 || k == 13 || k == 14) {
        dsp.name = 'act_hac_trs'
        if(k == 1) F.push({ lk: 'act_payment_address', t: 'main', lt: '' })
        else F.push(addrField('act_payment_address', act.from, main_address))
        if(k == 13) F.push({ lk: 'act_received_address', t: 'main', lt: '' })
        else F.push(addrField('act_received_address', act.to, main_address))
        F.push(amtField('act_amount', act.hacash, 'HAC'))

    // ---- SAT transfers (10/11/12) ----
    }else if((k == 10 || k == 11 || k == 12) && act.satoshi != undefined) {
        dsp.name = 'act_sat_trs'
        if(k == 10) F.push({ lk: 'act_payment_address', t: 'main', lt: '' })
        else F.push(addrField('act_payment_address', act.from, main_address))
        if(k == 11) F.push({ lk: 'act_received_address', t: 'main', lt: '' })
        else F.push(addrField('act_received_address', act.to, main_address))
        F.push(amtField('act_amount', act.satoshi, 'SAT'))

    // ---- asset transfers (17/18/19) ----
    }else if(k == 17 || k == 18 || k == 19) {
        dsp.name = 'act_asset_trs'
        if(k == 17) F.push({ lk: 'act_payment_address', t: 'main', lt: '' })
        else F.push(addrField('act_payment_address', act.from, main_address))
        if(k == 18) F.push({ lk: 'act_received_address', t: 'main', lt: '' })
        else F.push(addrField('act_received_address', act.to, main_address))
        F.push(fld('act_asset', 'str', assetAmtText(act.asset)))

    // ---- diamond transfers (5/6/7/8) ----
    }else if(k == 5 || k == 6 || k == 7 || k == 8) {
        dsp.name = 'act_transfer_diamond'
        let names = act.diamonds || act.diamond || ''
        let cnt = (names && typeof names == 'string') ? diamondCount(names) : 1
        F.push(numField('act_count', cnt, 'HACD'))
        F.push(diamondsField('act_diamond_value', names))
        if(k == 5 || k == 7) F.push({ lk: 'act_diamond_from_address', t: 'main', lt: '' })
        else F.push(addrField('act_diamond_from_address', act.from, main_address))
        if(k == 6 || k == 8) F.push({ lk: 'act_diamond_to_address', t: 'main', lt: '' })
        else F.push(addrField('act_diamond_to_address', act.to, main_address))

    // ---- channel open (2) ----
    }else if(k == 2) {
        dsp.name = 'act_open_channel'
        F.push(fld('act_channel_id', 'chn', act.channel_id))
        let lb = act.left_bill || {}
        , rb = act.right_bill || {}
        F.push(addrField('act_addr', act.left_addr || lb.address, main_address))
        F.push(amtField('act_amt', act.left_amt != undefined ? act.left_amt : lb.amount, 'HAC'))
        F.push(addrField('act_addr', act.right_addr || rb.address, main_address))
        F.push(amtField('act_amt', act.right_amt != undefined ? act.right_amt : rb.amount, 'HAC'))

    // ---- channel close (3) ----
    }else if(k == 3 || (k == 12 && act.channel_id)) {
        dsp.name = 'act_close_channel'
        F.push(fld('act_channel_id', 'chn', act.channel_id))

    // ---- diamond mint (4) ----
    }else if(k == 4) {
        dsp.name = 'act_mining_diamond'
        let d = act.d || {}
        let name = act.name || d.diamond
        let miner = act.miner || d.address
        F.push(fld('act_diamond_value', 'dia', name))
        if(d.number != undefined) F.push(numField('act_diamond_number', d.number))
        F.push(addrField('act_diamond_reward_address', miner, main_address))
        if(d.custom_message) {
            F.push(fld('act_diamond_message', 'str', bytesReadable(d.custom_message, 16)))
        }

    // ---- asset create (16) ----
    }else if(k == 16) {
        dsp.name = 'act_asset_create'
        let mt = act.metadata || {}
        F.push(numField('act_asset_serial', mt.serial))
        F.push(fld('act_asset_ticket', 'str', escapeHtml(bytesReadable(mt.ticket, 24))))
        F.push(fld('act_asset_name', 'str', escapeHtml(bytesReadable(mt.name, 24))))
        F.push(numField('act_asset_supply', mt.supply))
        F.push(numField('act_asset_decimal', mt.decimal))
        F.push(addrField('act_asset_issuer', mt.issuer, main_address))
        F.push(amtField('act_protocol_cost', act.protocol_cost, 'HAC'))

    // ---- tex cell execute (22, new) / channel assert (22/23/24/27 legacy) ----
    }else if(k == 22 && act.cells) {
        dsp.name = 'act_tex_exec'
        F.push(addrField('act_tex_addr', act.addr, main_address))
        let parts = []
        for(let i in act.cells) {
            let c = act.cells[i]
            if(!c || typeof c != 'object') continue
            let def = TEX_CELLS[c.cellid] || ('Cell' + c.cellid)
            let zh = typeof def == 'object' ? def : [def, def]
            let val = c.haczhu != undefined ? toThousandsStr(c.haczhu / 1e8) + ' HAC'
                : c.satnum != undefined ? toThousandsStr(c.satnum) + ' SAT'
                : c.dianum != undefined ? toThousandsStr(c.dianum) + ' HACD'
                : c.satoshi != undefined ? toThousandsStr(c.satoshi) + ' SAT'
                : c.diamonds != undefined ? c.diamonds
                : c.asset != undefined ? assetAmtText(c.asset)
                : c.height != undefined ? '#' + toThousandsStr(c.height)
                : c.chainid != undefined ? '' + c.chainid
                : ''
            parts.push(zh[1] + (val ? ' ' + val : ''))
        }
        F.push(fld('act_tex_cells', 'str', escapeHtml(parts.join('； '))))
        let sg = act.sign || {}
        if(sg.publickey) F.push(fld('act_tex_signer', 'hx', sg.publickey))

    }else if(k == 22 || k == 23 || k == 24 || k == 27) {
        dsp.name = 'act_chanassert'
        if(act.channel_id) F.push(fld('act_channel_id', 'chn', act.channel_id))
        if(!dsp.name) dsp.name = ''
        if(act.assert_address || act.assert_bill) {
            F.push(addrField('act_chanassert_addr', act.assert_address || (act.assert_bill || {}).address, main_address))
        }
        if(act.bill_number != undefined) F.push(numField('act_chanassert_billno', act.bill_number))

    // ---- AST select / if (25/26) ----
    }else if(k == 25 || k == 26) {
        dsp.name = k == 25 ? 'act_ast_select' : 'act_ast_if'
        let kids = []
        if(k == 25) {
            F.push(numField('act_ast_range', (act.exe_min || 0) + ' ~ ' + (act.exe_max || 0)))
            for(let i in (act.actions || [])) {
                kids.push(act.actions[i])
            }
        }else{
            for(let i in (act.cond || {}).actions || []) kids.push(act.cond.actions[i])
            for(let i in (act.br_if || {}).actions || []) kids.push(act.br_if.actions[i])
            for(let i in (act.br_else || {}).actions || []) kids.push(act.br_else.actions[i])
        }
        if(depth < 4) {
            dsp.children = []
            for(let i in kids) {
                dsp.children.push(normalizeAction(kids[i], main_address, trsinfo, depth + 1))
            }
        }

    // ---- inscriptions (32~36) ----
    }else if(k == 32) {
        dsp.name = 'act_insc_push'
        F.push(diamondsField('act_diamond_value', act.diamonds))
        F.push(fld('act_insc_content', 'str', escapeHtml(bytesReadable(act.engraved_content, 48))))
        if(act.engraved_type != undefined) F.push(numField('act_insc_type', act.engraved_type))
        F.push(amtField('act_protocol_cost', act.protocol_cost, 'HAC'))
    }else if(k == 33) {
        dsp.name = 'act_insc_clean'
        F.push(diamondsField('act_diamond_value', act.diamonds))
        F.push(amtField('act_protocol_cost', act.protocol_cost, 'HAC'))
    }else if(k == 34) {
        dsp.name = 'act_insc_edit'
        F.push(fld('act_diamond_value', 'dia', act.diamond))
        F.push(numField('act_insc_index', act.index))
        F.push(fld('act_insc_content', 'str', escapeHtml(bytesReadable(act.engraved_content, 48))))
        F.push(amtField('act_protocol_cost', act.protocol_cost, 'HAC'))
    }else if(k == 35 && act.from_diamond) {
        dsp.name = 'act_insc_move'
        F.push(fld('act_diamond_from', 'dia', act.from_diamond))
        F.push(fld('act_diamond_to', 'dia', act.to_diamond))
        F.push(numField('act_insc_index', act.index))
        F.push(amtField('act_protocol_cost', act.protocol_cost, 'HAC'))
    }else if(k == 36) {
        dsp.name = 'act_insc_drop'
        F.push(fld('act_diamond_value', 'dia', act.diamond))
        F.push(numField('act_insc_index', act.index))
        F.push(amtField('act_protocol_cost', act.protocol_cost, 'HAC'))

    // ---- contract deploy (40) ----
    }else if(k == 40) {
        dsp.name = 'act_contract_deploy'
        if(trsinfo && trsinfo.contract_address) {
            F.push(fld('act_contract_address', 'addr', trsinfo.contract_address))
        }
        F.push(numField('act_contract_nonce', act.nonce))
        let c = act.contract || {}
        if(c.inherit) F.push(numField('act_contract_inherits', c.inherit.length))
        if(c.library) F.push(numField('act_contract_libraries', c.library.length))
        F.push(amtField('act_protocol_cost', act.protocol_cost, 'HAC'))

    // ---- contract update (41) ----
    }else if(k == 41) {
        dsp.name = 'act_contract_update'
        F.push(addrField('act_contract_address', act.address, main_address))
        let e = act.edit || {}
        if(e.new_revision != undefined) F.push(numField('act_contract_revision', e.new_revision))
        F.push(amtField('act_protocol_cost', act.protocol_cost, 'HAC'))

    // ---- contract main call (44) ----
    }else if(k == 44) {
        dsp.name = 'act_contract_maincall'
        F.push(numField('act_contract_codeconf', act.codeconf))
        F.push(numField('act_contract_codesize', hexBytesLen(act.codes), 'Bytes'))

    // ---- p2sh prove (46) ----
    }else if(k == 46) {
        dsp.name = 'act_p2sh_prove'
        F.push(numField('act_contract_codeconf', act.codeconf))
        if(act.adrlibs && act.adrlibs.length) F.push(numField('act_contract_libraries', act.adrlibs.length))
        F.push(numField('act_p2sh_locksize', hexBytesLen(act.lockbox), 'Bytes'))
        if(act.merkels) F.push(numField('act_p2sh_merkels', act.merkels.length))

    // ---- message / blob (0x0401 / 0x0402) ----
    }else if(k == 0x0401) {
        dsp.name = 'act_message'
        F.push(fld('act_message_data', 'str', escapeHtml(bytesReadable(act.data, 64))))
    }else if(k == 0x0402) {
        dsp.name = 'act_blob'
        F.push(numField('act_blob_size', hexBytesLen(act.data), 'Bytes'))
        F.push(fld('act_blob_preview', 'hx', (act.data || '').replace(/^0[xX]/, '').substring(0, 128)))

    // ---- guards (0x0411 ~ 0x0414) ----
    }else if(k == 0x0411) {
        dsp.name = 'act_chain_allow'
        let chs = act.chains || []
        if(typeof chs == 'string') chs = chs.split(',').filter(Boolean).map(Number)
        F.push(fld('act_chain_list', 'str', escapeHtml(chs.join(', '))))
    }else if(k == 0x0412) {
        dsp.name = 'act_height_scope'
        let end = act.end || act.end_height || 0
        F.push(numField('act_height_range', (act.start || act.start_height || 0) + ' ~ ' + (end == 0 ? '∞' : end)))
    }else if(k == 0x0413) {
        dsp.name = 'act_balance_floor'
        F.push(addrField('act_addr', act.addr, main_address))
        if(act.hacash && parseFloat(act.hacash) > 0) F.push(amtField('act_amount', act.hacash, 'HAC'))
        if(act.satoshi > 0) F.push(amtField('act_amount', act.satoshi, 'SAT'))
        if(act.diamond > 0) F.push(numField('act_count', act.diamond, 'HACD'))
        let asts = act.assets || []
        if(asts.length) {
            F.push(fld('act_asset', 'str', escapeHtml(asts.map(assetAmtText).join('； '))))
        }
    }else if(k == 0x0414) {
        dsp.name = 'act_required_signers'
        let sgs = act.signers || []
        for(let i in sgs) {
            F.push(addrField('act_chanassert_addr', sgs[i], main_address))
        }
        if(!sgs.length) F.push(numField('act_count', 0))

    // ---- legacy kinds (pre-Istanbul data on mainnet) ----
    }else if(k == 9 || (k == 15 && act.lockbls_id)) {
        dsp.name = 'act_lockbls_create'
        if(act.lockbls_id) F.push(fld('act_lockbls_id', 'str', escapeHtml(act.lockbls_id)))
        if(act.amount != undefined) F.push(amtField('act_lockbls_create_amount', act.amount, 'HAC'))
    }else if(k == 10 && act.lockbls_id) {
        dsp.name = 'act_lockbls_release'
        F.push(fld('act_lockbls_id', 'str', escapeHtml(act.lockbls_id)))
        if(act.amount != undefined) F.push(amtField('act_lockbls_release_amount', act.amount, 'HAC'))
    }else if((k == 20 || k == 29) && (act.start != undefined || act.start_height != undefined)) {
        dsp.name = 'act_height_limit'
        F.push(numField('act_height_range', (act.start_height || act.start || 0) + ' ~ ' + (act.end_height || act.end || 0)))
    }else if(k == 30 && act.chain_id != undefined) {
        dsp.name = 'act_chain_id'
        F.push(numField('act_chain_list', act.chain_id))
    }else if(k == 35 && act.trs_no != undefined) {
        dsp.name = 'act_btcmove'
        F.push(numField('act_btcmove_trsno', act.trs_no))
        if(act.btc_num != undefined) F.push(numField('act_btcmove_btcnum', act.btc_num, 'BTC'))
        if(act.hac_subsidy != undefined) F.push(numField('act_btcmove_hacsubsidy', act.hac_subsidy, 'HAC'))
        if(act.lockbls_id) F.push(fld('act_btcmove_lockbls', 'str', escapeHtml(act.lockbls_id)))
        F.push(addrField('act_btcmove_address', act.address, main_address))
    }

    return dsp
}


function normalizeAction(one, main_address, trsinfo, depth) {
    // {action: {...}, description: "..."} wrapper when node descriptions requested
    let desc = ''
    if(one && typeof one == 'object' && one.action && typeof one.action == 'object') {
        desc = one.description || ''
        one = one.action
    }
    let act = Object.assign({}, one || {})
    let k = parseInt(act.kind || 0)

    // legacy address/amount normalization (kept from the original explorer)
    if(k == 1) {
        act.to = addrfmt(act.to, main_address)
    }else if(k == 13) {
        act.from = addrfmt(act.from, main_address)
    }else if(k == 14) {
        act.from = addrfmt(act.from, main_address)
        act.to = addrfmt(act.to, main_address)
    }else if(k == 10) {
        act.to = addrfmt(act.to, main_address)
    }else if(k == 11) {
        act.from = addrfmt(act.from, main_address)
    }else if(k == 12) {
        act.from = addrfmt(act.from, main_address)
        act.to = addrfmt(act.to, main_address)
    }else if(k == 5) {
        act.to = addrfmt(act.to, main_address)
        act.diamonds = act.diamonds || act.diamond || ''
        act.diamond = 1
    }else if(k == 6 || k == 7 || k == 8) {
        if(k == 6) {
            act.from = addrfmt(act.from, main_address)
            act.to = addrfmt(act.to, main_address)
        }else if(k == 7) {
            act.to = addrfmt(act.to, main_address)
        }else{
            act.from = addrfmt(act.from, main_address)
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

    act.dsp = buildDisplay(act, main_address, trsinfo, depth || 0)
    if(desc && !act.dsp.desc) act.dsp.desc = desc
    if(act.dsp.desc) act.dsp.desc = escapeHtml(act.dsp.desc)
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
    let acts = (out.actions || []).map(one => normalizeAction(one, main_address, out))
    // flatten AST nested child actions into indent rows
    let flat = []
    let walk = function(list, depth) {
        for(let i in list) {
            let one = list[i]
            one._depth = depth
            flat.push(one)
            let kids = (one.dsp && one.dsp.children) || []
            if(kids.length) walk(kids, depth + 1)
        }
    }
    walk(acts, 0)
    out.actions = flat
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
        description: true, // node canonical description for every action kind
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

    
