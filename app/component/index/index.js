
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


