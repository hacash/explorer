var rwdcis = [1,1,2,3,5,8,
    8,8,8,8,8,8,8,8,8,8,
    5,5,5,5,5,5,5,5,5,5,
    3,3,3,3,3,3,3,3,3,3,
    2,2,2,2,2,2,2,2,2,2,
    1,1,1,1,1,1,1,1,1,1,
    1,1,1,1,1,1,1,1,1,1,
]

var $blkrwd = $id('blkrwd')
;

function showCoinbasePace(cbh, rwd, circ, burn) {
    // 112358
    var $cblish = $clas($blkrwd, 'cblist')
    , cbsw = parseInt($cblish.offsetWidth)
    , cbsh = 128 //parseInt($cblish.offsetHeight)
    , tlpis = []
    ;
    var chi = parseInt(cbh / (10*10000))
    , cind = rwdcis[chi]
    , ctrds = 0
    , bs = []
    ;
    for(var i in rwdcis) {
        var h = rwdcis[i]
        , cla = ''
        ctrds += h
        if(i<chi) {
            cla = ' ps'
        }else if(i==chi) {
            cla = ' cur'
        }
        bs.push('<b class="h'+h+cla+'"><i>'+h+'</i></b>')
        // points
        var x = cbsw / 66 * i + 5
        , y = cbsh - (ctrds / 220.0 * cbsh)
        // console.log(ctrds / 220.0 )
        tlpis.push(x+','+y)
    }

    $cblish.innerHTML = bs.join('') + `<p class="tt">Block Reward in 66 Years</p><svg>  <polyline points="0,${cbsh} ${tlpis.join(' ')} 1000,0 1000,${cbsh}" stroke-width="1" stroke="#00880088" fill="#00880011" ></svg>`
    // reward percent
    var ttn = 2200*10000
    var per = parseFloat(rwd) / ttn * 100
    $clas($blkrwd, 'rwdper').innerHTML = `
        <div class="bar">
            <p class="tt">Mining Ratio</p>
            <div class="sld" style="width: ${per}%"><p>${per.toFixed(2)}%</p></div>
            <div class="num"><p>${rwd} / ${ttn}</p></div>
        </div>
    `
    // burn percent
    var ttcc = circ + burn
    , bcp1 = circ / ttcc * 100
    , bcp2 = burn / ttcc * 100
    ;
    $clas($blkrwd, 'burner').innerHTML = `
    <div class="cp c1" style="width: ${bcp1}%"><b>${circ.toFixed(1)}</b><i>Circulation</i><p>${bcp1.toFixed(1)}%</p></div>
    <div class="cp c2" style="width: ${bcp2}%"><div class="oo"></div><p>${bcp2.toFixed(1)}%</p><i>Burned</i><b>${burn.toFixed(1)}</b></div>
    `
}

// test
showCoinbasePace(471966, 1060604, 516253.9653, 544850.8617)



var vAppTotalSupply = new Vue({
    el: '#supply',
    data: {
        minted_diamond: "-", // The number of diamonds that have been minted successfully
        transferred_bitcoin: "-",
        block_reward: "-", // Block reward HAC accumulation
        channel_interest: "-", // Channel interest HAC accumulation
        btcmove_subsidy: "-", // BTC transfer and additional issuance of HAC
        burned_fee: "-", // tx fee by burning
        current_circulation: "-", // Current circulation supply
        located_in_channel: "-", // Real time statistics of HAc located in channel chain
        channel_of_opening: "-",
    },
    methods:{
        queryDatas: function(){
            var that = this
            apiget("/api/total/supply", {
            }, function(data){
                // console.log(data)
                // console.log(that)
                that.block_reward = toThousands(data.block_reward)
                that.minted_diamond = toThousands(data.minted_diamond)
                that.transferred_bitcoin = toThousands(data.transferred_bitcoin)
                that.channel_interest = toThousands(data.channel_interest)
                that.btcmove_subsidy = toThousands(data.btcmove_subsidy)
                that.burned_fee = toThousands(data.burned_fee)
                that.located_in_channel = toThousands(data.located_in_channel)
                that.channel_of_opening = toThousands(data.channel_of_opening)
                that.current_circulation = toThousands(data.current_circulation)
            })
        },

    }
})

// 请求数据
vAppTotalSupply.queryDatas()


///////////////////////////////


var vAppDiamondCreateTxs = new Vue({
    el: '#diamondcreatetxs',
    data: {
        period: 0,
        number: 0,
        txs: null,
    },
    methods:{
        queryDatas: function(){
            var that = this
            apiget("/api/diamond/createtxs", {
            }, function(data){
                // console.log(data)
                that.txs = data.datas
                that.period = data.period
                that.number = data.number
                // 获取最近六枚钻石图片
                vAppDiamondPicsLast6.queryLast6DiamondPicture(data.number)
            })
        },
    }
})

// 请求数据
vAppDiamondCreateTxs.queryDatas()


//////////////////////////////////////


var vAppDiamondPicsLast6 = new Vue({
    el: '#diampicslast6',
    data: {
        diamondstr: "",
    },
    methods:{

        // 查看指定钻石图片
        checkDiamonds: function(){
            var ds = this.diamondstr;
            if(!ds){
                return
            }
            window.open("/diaviews?dianames=" + ds)
        },

        // 请求最近六枚钻石图片
        queryLast6DiamondPicture: function(pendding_dianum){
            var that = this
            apiget("/api/diamond/visual_gene_list", {
                start_number: pendding_dianum - 6,
                limit: 6,
            }, function(data){
                // console.log(data)
                // 倒序
                var datalist = [];
                for(var n=data.list.length-1; n>=0; n--){
                    datalist.push(data.list[n])
                }
                // console.log(datalist)
                that.showLast6diamondPic(datalist, pendding_dianum)

            })
        },
        // 显示钻石可视化6枚
        showLast6diamondPic(datalist, pendding_dianum) {
            var blk = document.getElementById("diampicslast6")
            var picdivs = blk.getElementsByClassName("diapic")
            var more =  document.getElementById('lastdiampics').getElementsByClassName("more")[0]
            for(var n=0; n<datalist.length; n++){
                var one = datalist[n]
                , li = picdivs[n]
                , visual_gene = DiamondLifeGeneConvertVisualGene(one.life_gene, one.name)
                ;
                li.setAttribute("href", '/diamond/' + one.name)
                more.setAttribute("href", '/diaviews/last?curdianum=' + (pendding_dianum-1))
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


    }
});




//////////////////////////////////////


var vAppTransfers = new Vue({
    el: '#transfers',
    data: {
        transfers: [],
        refreshTip: "↺Refresh",
        refreshBtn: true,
        showMoreBtn: false,
        page: 1,
        limit: 15,
    },
    methods:{
        dealDatas: function(data) {
            for(var i in data){
                var one = data[i]
                , amt = one[3]
                ;
                var per = 0.0
                // console.log(amt)
                if(amt.indexOf('ㄜ') >= 0) {
                    amt = amt.replace(/ㄜ/, '').replace(/\,/g, '')
                    var num = parseFloat(amt)
                    , unit = parseInt(amt.split(':')[1])
                    if(unit > 248) {
                        num *= Math.pow(10, unit - 248)
                    }
                    if(unit < 248) {
                        num /= Math.pow(10, 248 - unit)
                    }
                    per = parseFloat(num)
                    // console.log(per)
                }else if(amt.indexOf('HACD') > 0) {
                    per = parseFloat(amt)
                }else if(amt.indexOf('SAT') > 0) {
                    per = parseFloat(amt) / 100 * 10000
                }
                if(per > 100) {
                    per = 100
                }
                if(per <= 1){
                    per = 1
                }
                data[i].push(per+'%')
            }
        },
        queryTransferDatas: function(){
            var that = this
            apiget("/api/transfer/logs", {
                page: that.page,
                limit: that.limit,
            }, function(data){
                that.dealDatas(data)
                that.transfers = that.transfers.concat(data)
                that.page++
                that.showMoreBtn = data.length==that.limit ? true : false
            })
        },
        refresh: function(){
            var that = this
            that.transfers = []
            that.page = 1
            that.refreshBtn = false
            setTimeout(function(){
                that.refreshBtn = true
                that.refreshTip = "Data ok!";
                setTimeout(function(){
                    that.refreshTip = "↺Refresh";
                }, 3000)
                that.queryTransferDatas()
            }, 300)
        },
    }
})


// 请求数据
vAppTransfers.queryTransferDatas()





//////////////////////////////////////////////////////////////////




var vAppOperateActionLogs = new Vue({
    el: '#operateactionlogs',
    data: {
        operateactionlogs: [],
        showMoreBtn: true,
        firstMore: true,
        page: 1,
        limit: 15,
    },
    methods:{
        getDataJumpRoute: function(tystr) {
            if( tystr.indexOf("channel") != -1 ){
                return "channel"
            }else if( tystr.indexOf("user lending") != -1 ){
                return "usrlend"
            }else if( tystr.indexOf("diamond syslend") != -1 ){
                return "dialend"
            }else if( tystr.indexOf("bitcoin syslend") != -1 ){
                return "btclend"
            }else if( tystr.indexOf("bitcoin move") != -1 ){
                return "lockbls"
            }else if( tystr.indexOf("lockbls open") != -1 ){
                return "lockbls"
            }
        },
        queryTransferDatas: function(){
            var that = this
            that.firstMore = false
            apiget("/api/operate/actionlogs", {
                page: that.page,
                limit: that.limit,
            }, function(data){
                that.operateactionlogs = that.operateactionlogs.concat(data)
                that.page++
                that.showMoreBtn = data.length==that.limit ? true : false
            })
        },
    }
})

// 请求数据
// vAppOperateActionLogs.queryTransferDatas()



//////////////////////////////////////////////////////////////////




var vAppRanking = new Vue({
    el: '#ranking',
    data: {
        tabn: "",
        dtcaches: {},
        list: null,
    },
    methods:{
        showList: function(name, list){
            var that = this
            that.list = list
        },
        selectTab: function(name){
            // alert(name)
            var that = this
            that.tabn = name
            if(that.dtcaches[name]){
                return that.showList(name, that.dtcaches[name])
            }
            apiget("/api/ranking/top", {
                kind: name,
            }, function(data){
                if(data.list || data.list.length>0){
                    var items = []
                    for(var i in data.list){
                        var one = data.list[i]
                          , li = one.split(" ")
                        // console.log(li)
                        items.push({
                            num: parseInt(i)+1,
                            address: li[0],
                            value: li[1],
                            percent: li[2]
                        })
                    }
                    that.showList(name, items)
                    that.dtcaches[name] = items
                }else{
                    that.showList(name, [])
                    that.dtcaches[name] = []
                }
            })
        },

    }
})

// vAppRanking.selectTab("hacash")







//////////////////////////////////////////////////////////////////



var vAppDfcts = new Vue({
    el: '#dfcts',
    data: {
        target_hashpower: '0 H/s',
        current_hashpower: '0 H/s',
    },
    methods:{
    }
})


var vAppBlocks = new Vue({
    el: '#blocks',
    data: {
        last_height: last_height,
        last_cuttime: 66,
        blocks: [],
        pagelimit: 11,

        showMoreBtn: false,
    },
    methods:{
        updateLastHeight: function(newhei){
            if(newhei > this.last_height){
                // 请求最新的数据
                this.queryNewDatas(newhei, newhei-this.last_height, true)
                this.last_height = newhei
            }
        },
        queryNewDatas: function(last, limit, addfront){
            var that = this
            apiget("/api/block/list", {
                last: last,
                limit: limit,
            }, function(data){
                that.showMoreBtn = true
                if(addfront){
                    that.blocks = data.datas.concat(that.blocks)
                }else{
                    that.blocks = that.blocks.concat(data.datas)
                }
            })
        },
        queryMoreDatas: function(){
            if(this.blocks[0]){
                this.showMoreBtn = false
                var last = this.blocks[this.blocks.length-1].height - 1
                this.queryNewDatas(last, vAppBlocks.pagelimit)
            }
        }
    },
})



// 定时更新 last heigth
setInterval(function(){
    if( vAppBlocks.last_cuttime <= 1 ){
        return
    }
    vAppBlocks.last_cuttime -= 1
    if( vAppBlocks.last_cuttime == 1 ){
        apiget("/api/block/last", {}, function(data){
            vAppBlocks.last_cuttime = 66
            vAppBlocks.updateLastHeight(data.height) // 更新数据
        })
    }
}, 1000)

// 默认加载数据
vAppBlocks.queryNewDatas(last_height, vAppBlocks.pagelimit)




////////////////////////////////////////////////



function drawDifficultyCharts(idname, data, theme){
    // 绘制算力曲线
    //获取Canvas对象(画布)
    var cvs = document.getElementById(idname);
    //简单地检测当前浏览器是否支持Canvas对象，以免在一些不支持html5的浏览器中提示语法错误
    if(cvs.getContext){  
        //获取对应的CanvasRenderingContext2D对象(画笔)
        cvs.width = parseInt(getStyle(cvs, "width"))
        var ctx = cvs.getContext("2d")
        ctx.lineWidth = 1;
        // 坐标轴距离画布上右下左的边距
        var padding = {
            top: 2,
            right: 2,
            bottom: 2,
            left: 2
        }
        // 求坐标轴原点的坐标
        var origin = {
            x: padding.left,
            y: cvs.height - padding.bottom
        }
        // 求坐标轴默认可显示数据的范围
        var coordMaxX = cvs.width - padding.left - padding.right;
        var coordMaxY = cvs.height - padding.top - padding.bottom ;

        // var data = [ 100, 200, 400, 600, 1200, 1800, 1000, 500, 20 ];
 
        // 求数据缩放的比例
        var ratioX = coordMaxX / data.length;
        var maxd = Math.max.apply( null, data )
        var ratioY = coordMaxY / maxd;
 
        // 根据比例，对元数据进行缩放
        var ratioData = data.map( function( val, index ) {
            return val * ratioY;
        });

        // 画网格
        var grcl = theme == 'white' ? '#ccc' : '#444';
        drawGrid(ctx, grcl, 20, 50);
 
        // 画折线
        ctx.beginPath();
        var pancl = theme == 'white' ? '#000' : '#fff';
        ctx.strokeStyle = pancl
        ratioData.forEach( function( val, index ) {
            ctx.lineTo( origin.x + ( index * ratioX), origin.y - val );
        });
        ctx.stroke();

        
        

    }
}

// 加载算力难度值
// apiget("/api/difficulty/charts", {}, function(data){
//     console.log(data)
//     // vAppDfcts.hashpower = data.hashpower
//     drawDifficultyCharts(data.nums)
// })

// // 加载算力难度值
// apiget("/api/difficulty/chartsv2", {}, function(data){
//     console.log(data)
//     // vAppDfcts.hashpower = data.hashpower
//     // historys    days30
//     // var nums = data.historys.concat(data.days30)
//     var nums = data.days30
//     drawDifficultyCharts(nums)
// })

// // 加载算力值
// apiget("/api/difficulty/powpower", {}, function(data){
//     console.log(data)
//     vAppDfcts.target_hashpower = data.target_show
//     vAppDfcts.current_hashpower = data.current_show
// })


// 加载算力难度值
apiget("/api/difficulty/chartsv3", {}, function(data){
    // console.log(data)
    vAppDfcts.target_hashpower = data.target_show
    vAppDfcts.current_hashpower = data.current_show
    // vAppDfcts.hashpower = data.hashpower
    // historys    days30
    // var nums = data.historys.concat(data.days30)
    // nums.pop()
    // console.log(nums)
    var thm = theme == 2 ? 'black' : 'white';
    drawDifficultyCharts("dfcts_canvas", data.days30, thm)
    drawDifficultyCharts("dfcts_canvas_all", data.daysall, thm)
})

setTimeout(function(){
    // drawDifficultyCharts([9,1,5,8,4,3,5,7,6,4,5])
}, 1000)



// 画网格

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