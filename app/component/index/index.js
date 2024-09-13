

// data callback
let allNoticeTotalSupply = [];




/********************** top search **********************/

 
;VueCreateAppCommon('topsc', {
    search_str: "",
},{
    keyEnterSearch(e) {
        if(e.key=="Enter"){
            this.clickSearch()
        }
    },
    clickSearch() {
        let t = this,
        ss = t.search_str
        doHeaderSearch(ss)
    }
});


/********************** total supply **********************/


const rwdcis = [1,1,2,3,5,8,
    8,8,8,8,8,8,8,8,8,8,
    5,5,5,5,5,5,5,5,5,5,
    3,3,3,3,3,3,3,3,3,3,
    2,2,2,2,2,2,2,2,2,2,
    1,1,1,1,1,1,1,1,1,1,
    1,1,1,1,1,1,1,1,1,1,
]

const $blkrwd = $id('blkrwd')
;

function showCoinbasePaceChart(that, cbh, rwd, circ, burn) {
    // console.log(cbh, rwd, circ, burn)
    // 112358
    var $cblish = $clas($blkrwd, 'cblist')
    , cbsw = 930 // parseInt($cblish.offsetWidth)
    , cbsh = 128 //parseInt($cblish.offsetHeight)
    , tlpis = []
    , tzlpt = []
    ;
    var chi = parseInt(cbh / (10*10000))
    , cind = rwdcis[chi]
    , ctrds = 0
    , bs = []
    , reduce_days = '*'
    , ch = 0
    , chtt = 0
    ;
    for(var i in rwdcis) {
        var h = rwdcis[i]
        , cla = ''
        ctrds += h
        if(i<chi) {
            cla = ' ps'
            chtt += h
        }else if(i==chi) {
            cla = ' cur'
            ch = h
            chtt += h
            // console.log("spxd:", i)
            var spxd = 100*10000*(parseInt(i)-4) + 600000
            reduce_days = parseInt((spxd - cbh) / 288) + 1
        }
        bs.push('<b class="h'+h+cla+'"><i>'+h+'</i></b>')
        // points
        var x = cbsw / 66 * i + 13
        , y = cbsh - (ctrds / 220.0 * cbsh)
        // console.log(ctrds / 220.0 )
        tlpis.push(x+','+y)
        // console.log(h/ctrds,cbsh )
        var tzl = cbsh - (parseFloat(h) / parseFloat(ctrds)) * cbsh
        tzlpt.push(x+','+tzl)
    }
    // console.log(parseFloat(ch) , chtt)
    var rdcyear = reduce_days<366 ? '' : ( ' ('+(reduce_days/365).toFixed(2)+' Years)')
    that.cblist = bs.join('') + `<p class="tt">Block Reward in 66 Years<br/>
        After ${reduce_days} Days${rdcyear} Reduce to 5 HAC<br/>
        Current Annual Inflation Ratio: ${(parseFloat(ch)/chtt*100).toFixed(2)}%</p><svg>  
        <polyline points="2,${cbsh} ${tlpis.join(' ')} 2000,0 2000,${cbsh}" stroke-width="1" stroke="#00880088" fill="#00880011" />
        <polyline points="${tzlpt.join(' ')}" stroke-width="1" stroke-dasharray="2 2" stroke="#99440066" fill="none"/>
        </svg>`
    // reward percent
    var ttn = 2200*10000
    var per = parseFloat(rwd) / ttn * 100
    that.rwdper = `
        <div class="bar">
            <p class="tt">Mined Ratio</p>
            <div class="sld" style="width: ${per}%"><p>${per.toFixed(2)}%</p></div>
            <div class="num"><p>${toThousands(rwd)} / ${toThousands(ttn)}</p></div>
        </div>
    `
    // burn percent
    var ttcc = circ + burn
    , bcp1 = circ / ttcc * 100
    , bcp2 = burn / ttcc * 100
    ;
    that.burner = `
    <div class="cp c1" style="width: ${bcp1}%"><b>${toThousands(circ.toFixed(1))}</b><i class="tt">Circulation</i><p>${bcp1.toFixed(1)}%</p></div>
    <div class="cp c2" style="width: ${bcp2}%"><div class="oo"></div><p>${bcp2.toFixed(1)}%</p><i class="tt">Burned</i><b>${toThousands(burn.toFixed(1))}</b></div>
    `
}


// total supply
;VueCreateAppCommon('supply', {
    // html con
    cblist: '',
    rwdper: '',
    burner: '',
    // supply data
    d: { /*
        current_circulation: 924057.13249348,
        trsbtc_subsidy: 0,
        channel_opening: 22,
        diamond_engraved: 1588,
        channel_deposit: 73070.004,
        channel_interest: 1160.9167153,
        burned_fee: 897158.78422182,
        transferred_bitcoin: 0,
        minted_diamond: 96633,
        burned_diamond_bid: 897158.78422182,
        block_reward: 1820055, */
    }, 
},{
    toThousands,
    querySupply() {
        let t = this;
        apiget("/api/total/supply", {
        }, function(data){
            t.d = data
            // 
            for(let i in allNoticeTotalSupply){
                allNoticeTotalSupply[i](data);
            }
            // show Chart
            showCoinbasePaceChart(
                t, data.latest_height, 
                parseInt(data.block_reward), 
                parseFloat(data.current_circulation), 
                parseFloat(data.burned_fee)
            )         
        })
    }
}, function() {
    this.querySupply()
});




/********************** hashrate **********************/

;VueCreateAppCommon('dfcts', {
    tg_hs: '0 H/s',
    rt_hs: '0 H/s',
},{
    queryCharts() {
        var t = this;
        apiget("/api/hashrate/charts", {}, function(data){
            // console.log(data)
            t.tg_hs = data.target.show
            t.rt_hs = data.realtime.show
            var thm = theme == 2 ? 'black' : 'white';
            drawHashrateCharts("dfcts_canvas", data.day200, thm)
            drawHashrateCharts("dfcts_canvas_all", data.dayall, thm)
        })
    }
},function() {
    this.queryCharts()
});


function drawGrid(context, color, stepx, stepy) {
    context.save()
    // context.fillStyle = 'white';
    // console.log(context);
    //context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    context.setLineDash([2,6]);
    context.lineWidth = 0.5;
    context.strokeStyle = color;
    for (var i = stepx; i < context.canvas.width; i += stepx) {
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, context.canvas.height);
        context.closePath();
        context.stroke();
    }
    for (var j = stepy; j < context.canvas.height; j += stepy) {
        context.beginPath();
        context.moveTo(0, j);
        context.lineTo(context.canvas.width, j);
        context.closePath();
        context.stroke();
    }
    context.restore();
}


function drawHashrateCharts(idname, data, theme){
    var cvs = document.getElementById(idname);
    if(!cvs.getContext){  
        return
    }
    //get CanvasRenderingContext2D 
    cvs.width = parseInt(getStyle(cvs, "width"))
    var ctx = cvs.getContext("2d")
    ctx.lineWidth = 1;
    // get distance between the axis and the bottom-right left margin on the canvas
    var padding = {
        top: 2,
        right: 2,
        bottom: 2,
        left: 2
    }
    // get the coordinates of the axis origin
    var origin = {
        x: padding.left,
        y: cvs.height - padding.bottom
    }
    // get default axis displays the range of the data
    var coordMaxX = cvs.width - padding.left - padding.right;
    var coordMaxY = cvs.height - padding.top - padding.bottom ;

    // var data = [ 100, 200, 400, 600, 1200, 1800, 1000, 500, 20 ];

    // clal the scale of the data
    var ratioX = coordMaxX / data.length;
    var maxd = Math.max.apply( null, data )
    var ratioY = coordMaxY / maxd;

    // metadata is scaled according to scale
    var ratioData = data.map( function( val, index ) {
        return val * ratioY;
    });

    // draw grid
    var grcl = theme == 'white' ? '#ccc' : '#444';
    drawGrid(ctx, grcl, 20, 50);

    // draw polyline
    ctx.beginPath();
    var pancl = theme == 'white' ? '#000' : '#fff';
    ctx.strokeStyle = pancl
    ratioData.forEach( function( val, index ) {
        ctx.lineTo( origin.x + ( index * ratioX), origin.y - val );
    });
    ctx.stroke();
}



/********************** diamond bidding **********************/


;VueCreateAppCommon('diabid', {
    number: 0,
    txs: [],
}, {
    queryBids: function(){
        var t = this
        apiget("/api/diamond/bidding", {
        }, function(data){
            // console.log(data)
            t.txs = table_to_list(data)
            t.number = data.number
        })
    },
}, function(){
    this.queryBids();
})


/********************** latest diamond views **********************/

;VueCreateAppCommon('diapic6', {
    scdiastr: '',
}, {
    checkDias() {
        var ds = this.scdiastr;
        if(ds){
            window.open("/diamond-views?name=" + ds)
        }
    },
    latest6() {
        var t = this
        apiget("/api/diamond/views?latest6=true", {}, function(data){
            let list = table_to_list(data)
            t.show6(list)
        })
    },
    show6(datalist) {
        let blk = $id("diapic6")
        , picdivs = $class(blk, "diapic")
        , more = $clas($id("ltsdias"), "more")
        for(var n=0; n<datalist.length; n++){
            var one = datalist[n]
            , li = picdivs[n]
            , visual_gene = DiamondLifeGeneConvertVisualGene(one.life_gene, one.name)
            ;
            li.setAttribute("href", '/diamond/' + one.name)
            more.setAttribute("href", '/diamond-views')
            // dvhip = 5
            var diapic = CreateDiamondImageTagSVG(visual_gene, 140)
            // dvhip = 8
            var dbk = theme == 2 ? '#333' : 'white'; 
            if(dvhip==8) {
                // console.log(visual_gene)
                diapic = CreateDiamondBrillianceSVG(visual_gene, 140, dbk)
            }
            if(dvhip==9) {
                diapic = CreateLifeGameInitialSVG(one.life_gene, 120, dbk)[0]
            }
            picdivs[n].innerHTML = diapic
                + '<h3 class="name">' + one.name + '</h3>'
                + '<p class="num">#' + one.number + '</p>'
        }
    },

}, function(){
    this.latest6()
});



/********************** recent fork blocks **********************/


function drawRecentBlocks(recent_blocks){

    const rctblkpsrli = function(rct) {
        var right = '';
        if(rct.nexts&&rct.nexts.length){
            right = `<div class="right">${rctblkpsrloopary(rct.nexts)}</div>`
        }
        return `<div class="itwp"><div class="left"><div id="${rct.hx}" class="blk  h${rct.hi} ${!right?'leaf':''}"><div class="rect h${rct.hi} ">
                <p class="">${rct.height}</p>
                <!--<p>${rct.hx}</p>
                <p>${rct.txs}</p>-->
                <p class="b">${rct.msg}</p>
                <p class="m">${rct.miner}</p>
                <p class="t">${formatDate(new Date(rct.arrive*1000), 'hh:mm:ss')}</p>
            </div></div></div>${right}</div>`;
    };

    const rctblkpsrloopary = function(list) {
        var ary = []
        for(var i in list) {
            ary.push( rctblkpsrli(list[i]) )
        }
        return ary.join('')
    };


    var rctblks = $id('rctblks')
    , rctblks_con = $clas(rctblks, 'con')
    ;
    rctblks_con.innerHTML = '<div class="box"><svg class="lines"></svg>'+rctblkpsrloopary(recent_blocks)+'</div>'


    const rctblksdrawlines = function() {
        var $blks = $class(rctblks, 'blk')
        , $svg =  $clas(rctblks, 'lines')
        , svgxy = $svg.getBoundingClientRect()
        , xleft = svgxy.left
        , xtop =  svgxy.top
        ;
        for(var i=0; i<$blks.length; i++) {
            var li = $blks[i]
            , rect = li.getBoundingClientRect()
            li.setAttribute('x', rect.left - xleft)
            li.setAttribute('y', rect.top - xtop)
        }
        // 
        var draw_lines = [`<rect width="49.8%" height="100%" style="fill: #0000000f;" />`]
        function xy(e, n) {
            return parseInt(e.getAttribute(n))
        }
        function drawgroup(blk) {
            var blkhw = 46
            , $div = $id(blk.hx)
            , x1 = xy($div, 'x') + blkhw
            , y1 = xy($div, 'y') + blkhw
            ;
            // nexts
            for(var i in blk.nexts) {
                var one = blk.nexts[i]
                , $chd =  $id(one.hx)
                , x2 = xy($chd, 'x') + blkhw
                , y2 = xy($chd, 'y') + blkhw
                , line = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"></line>`
                draw_lines.push(line)
                drawgroup(one) // draw child
            }
        }
        for(var i in recent_blocks) {
            drawgroup(recent_blocks[i])
        }
        $svg.innerHTML = draw_lines.join('')
    }

    setTimeout(rctblksdrawlines, 50)
}


apiget("/api/block/recents", {}, function(data){
    drawRecentBlocks(data.list)
})



/********************** all blocks **********************/



;VueCreateAppCommon('blocks', {
    blocks: [],
    page: 0,
    limit: 15,
},{
    formatDate,
    queryBlks: function(){
        let t = this;
        t.page += 1;
        let params = {
            desc: true,
            page: t.page,
            limit: t.limit,
        }
        if(t.page == 1) {
            params.page1 = true // use cache
        }
        apiget("/api/block/views", params, function(data){
            let list = table_to_list(data)
            t.blocks = t.blocks.concat(list)
        })
    }
}, function() {
    // auto load first page
    this.queryBlks()
})



/********************** all coin transfer **********************/



;VueCreateAppCommon('tsfs', {
    transfers: [],
    page: 0,
    limit: 20,
},{
    queryLogs() {
        let t = this;
        t.page += 1;
        let params = {
            page: t.page,
            limit: t.limit,
        }
        if(t.page == 1) {
            params.page1 = true // use cache
        }
        let rlamtwid = function(ty, amt) {
            if(ty == 1){
                let a = parseFloat(amt) / 100000000.0
                return ['ㄜ' + a, a + '%']
            }else if(ty == 2){
                let pr = parseFloat(amt)/1000000.0;
                return [amt + ' SAT', pr + '%']
            }else if(ty == 3){
                let pr = parseFloat(amt);
                return [amt + ' HACD', pr + '%']
            }
            return [amt, '']
        }
        apiget("/api/actlogs/cointrs", params, function(data){
            let addrs = data.addrs
            , list = data.list;
            for(let i in list ){
                let li = list[i]
                li[1] = addrs[li[1]+'']
                li[2] = addrs[li[2]+'']
                let amtwd = rlamtwid(li[3], li[4])
                li[3] = amtwd[0] // amout
                li[4] = amtwd[1] // percent
            }
            t.transfers = t.transfers.concat(list)
        })
    }
}, function() {
    // auto load first page
    this.queryLogs()
})



;VueCreateAppCommon('actopts', {
    logs: [],
    showMoreBtn: true,
    firstMore: true,
    page: 0,
    limit: 20,
}, {
    geTarIdJumpUrl(ty, id) {
        if( ty == 1 || ty == 2 ){
            return `/channel/${id}`
        }
        return '#'
    },
    queryLogs(){
        var t = this
        t.page++
        t.firstMore = false
        const optns = {'1': 'channel open', '2': 'channel close'}
        apiget("/api/actlogs/fiopts", {
            page: t.page,
            limit: t.limit,
        }, function(data){
            let addrs = data.addrs
            , list = data.list;
            for(let i in list ){
                let li = list[i]
                li[1] = addrs[li[1]+''] || ''
                li[2] = addrs[li[2]+''] || ''
                li.push(t.geTarIdJumpUrl(li[3], li[4])) // 6
                li[3] = optns[li[3]] || '~'
            }
            t.logs = t.logs.concat(list)
        })
    },
}, function(){
    // this.queryLogs()
})





/********************** miner pool stats **********************/



;VueCreateAppCommon('poolct', {
    percts: null,
},{
    queryStats() {
        let t = this;
        apiget("/api/block/pools", {}, function(data){
            let percts = [];
            let keys = {};
            for(var a in data.curr){
                keys[a] = true
            }
            for(var a in data.prev){
                keys[a] = true
            }
            for(var a in keys) {
                let ks = a.split(':')
                let n1 = data.curr[a] || 0;
                let n2 = data.prev[a] || 0;
                percts.push({
                    name: ks[0],
                    adr: ks[1]||'',
                    n1, n2,
                    count: n1+n2,
                    per:(parseFloat(n1+n2) / 4032.0 * 100).toFixed(2),
                    chgp: ((parseFloat(n1-n2)/4032.0) * 100).toFixed(2)
                })
            }
            percts.sort(function(a,b){
                return b.count - a.count
            })
            let maxw = parseFloat((percts[0]||{}).count||100)
            for(var i in percts) {
                let li = percts[i];
                li.width = parseFloat(li.count) / maxw
            }
            // console.log(percts)
            t.percts = percts
        })
    }
}, function(){
    // this.queryStats()
});







/********************** ranking top **********************/



;let vueRankingApp = VueCreateAppCommon('ranking', {
    tabn: "",
    dtcaches: {},
    list: null,
    actives: null,
    supply: {},
},{
    queryActive() {
        let t = this;
        /*
            secnum:  Uint4
            newadr:  Uint4 // new address
            txs:     Uint4
            trszhu:  Uint4
            trssat:  Uint4
            trsdia:  Uint4
            mvzhu:   Uint8 // HAC: ZHU
            mvsat:   Uint8 // SAT
            mvdia:   Uint3 // DIAMOND
        */
        apiget("/api/ranking/active", {}, function(data){
            let list = data.list;
            let actvs = [];
            for(let i in list){
                let one = list[i];
                actvs.push(one);
            }
            t.actives = actvs;
        });
    },
    selectTop(coin) {
        // alert(coin)
        let t = this;
        t.tabn = coin
        if(t.dtcaches[coin]){
            return t.list = t.dtcaches[coin]
        }
        let splkey = {HAC: 'current_circulation', HACD: 'minted_diamond', BTC: 'transferred_bitcoin'}
        apiget("/api/ranking/top100", {
            coin: coin,
        }, function(data){
            if(data.list || data.list.length>0){
                let items = []
                for(let i in data.list){
                    let li = data.list[i]
                    , per = li[1] / (t.supply[splkey[coin]] || 1) * 100;
                    items.push({
                        num: parseInt(i)+1,
                        addr: li[0],
                        amount: coin=='HACD' ? li[1] : li[1].toFixed(2),
                        percent: per.toFixed(2),
                    })
                }
                t.list = items;
                t.dtcaches[coin] = items
            }else{
                t.list = [];
                t.dtcaches[coin] = [] // btc
            }
        })
    },
}, function(){

    let t = this;
    allNoticeTotalSupply.push(function(data){
        t.supply = data;
        // t.selectTop('HAC')
        // t.queryActive()
    })
});

