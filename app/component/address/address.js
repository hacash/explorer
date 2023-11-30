
var vAppAddress = new Vue({
    el: '#address',
    data: {
        hacash_amount: '-',
        satoshi_amount: '-',
        diamond_amount: '-',
        diamond_mined: '-',
        address: '',
        trstype: 'all',
        transfers: null,
        trspage: 1, // 翻页
        trslimit: 15, //
        trsifmore: false, // 是否显示更多 
        trsfirstbtn: true, // 首次显示转账
        ranking_api_url: "",
        all_diamond_names: "",
        operateactionlogs: null,
        colpage: 1,
        collimit: 15,
        colifmore: false, // 是否显示更多 
        colfirstbtn: true, // 首次显示
        ckvdmnas: '', // 查看钻石可视化
    },
    methods:{
        // 加载余额
        queryAmount: function(){
            var that = this
            // console.log(ranking_api_url)
            that.address = that.$refs.address.dataset.address // 赋值
            if(window.ranking_api_url) {
                that.ranking_api_url = window.ranking_api_url
            }
        },
        // 加载更多转账
        domoretrs: function(){
            var that = this
            // that.transfers
            // alert(that.trstype)
            // 加载
            that.trsfirstbtn = false
            apiget("/api/transfer/logs", {
                address: that.address,
                type: that.trstype,
                page: that.trspage,
                limit: that.trslimit,
            }, function(data){
                let myaddr = that.address.substr(0,7) + '…'
                let my =  '<u class="my" title="'+that.address+'">'+myaddr+'</u>'
                for(let i in data){
                    if(data[i][1] == that.address){
                        data[i][1] =my
                    }
                    if(data[i][2] == that.address){
                        data[i][2] = my
                    }
                }
                if(!that.transfers) {
                    that.transfers = []
                }
                that.transfers = that.transfers.concat(data)
                // page ++ 
                that.trspage ++ 
                if (data.length == that.trslimit) {
                    that.trsifmore = true
                }else{
                    that.trsifmore = false
                }
            })
        },
        // 选择转账种类
        dotrstype: function(){
            var that = this
            , oldtt = that.trstype
            that.trsfirstbtn = false
            setTimeout(function(){
                if (oldtt != that.trstype) {
                    that.transfers = [] // 清空
                    that.trspage = 1
                }
            },11)
            // 加载数据
            setTimeout(that.domoretrs, 500)
            // 显示访问
        },
        // 查看所有钻石
        alldiamondnames: function(){
            var that = this
            apiget("/api/ranking/diamonds", {
                address: that.address,
            }, function(data){
                if(data.diamonds) {
                    var dias = "<i>"
                    var dianum = 0;
                    for(var i=0; i+6<=data.diamonds.length; i+=6) {
                        if(i==0){
                            dias += data.diamonds.substr(i, 6)
                        }else{
                            dias += "</i>,<i>" + data.diamonds.substr(i, 6)
                        }
                        dianum ++;
                    }
                    that.all_diamond_names = dias + "</i>"
                }else{
                    that.all_diamond_names = "-"
                }
            })
        },
        // 查看钻石可视化
        chdmsvsl: function(){
            var dms = this.ckvdmnas.replace(/[^WTYUIAHXVMEKBSZN\,]+/ig, "")
            dms = dms.replace(/^\,+|\,+$/ig, '')
            window.open('/diaviews?dianames='+dms)
        },
        // 查看金融操作记录
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
        loadoperateactionlogs: function(){
            var that = this
            // 加载
            that.colfirstbtn = false
            apiget("/api/operate/actionlogs", {
                address: that.address,
                page: that.colpage,
                limit: that.collimit,
            }, function(data){
                let myaddr = that.address.substr(0,7) + '…'
                let my =  '<u class="my" title="'+that.address+'">'+myaddr+'</u>'
                for(let i in data){
                    if(data[i][3] == that.address){
                        data[i][3] = my
                        data[i][4] = '<a class="addr" target="_blank" href="/address/'+data[i][4]+'">'+data[i][4]+'</a>'
                    }else if(data[i][4] == that.address){
                        data[i][4] = my
                        data[i][3] = '<a class="addr" target="_blank" href="/address/'+data[i][3]+'">'+data[i][3]+'</a>'
                    }
                }
                if(!that.operateactionlogs) {
                    that.operateactionlogs = []
                }
                that.operateactionlogs = that.operateactionlogs.concat(data)
                // page ++ 
                that.colpage ++ 
                if (data.length == that.collimit) {
                    that.colifmore = true
                }else{
                    that.colifmore = false
                }
            })
        },
    }
})

// 请求数据
vAppAddress.queryAmount()

// vAppAddress.loadchannelopenlogs()






