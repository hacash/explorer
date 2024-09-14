


;VueCreateAppCommon('address', {
    address: '',
    trstype: 'all',
    cointrs: null,
    trspage: 0,
    trslimit: 20,
    trsifmore: false,
    trsfirstbtn: true,
    ranking_api_url: "",
    all_diamond_names: "",
    optlogs: null,
    colpage: 0,
    collimit: 20,
    colifmore: false,
    colfirstbtn: true,
    ckvdmnas: '',
},{
    init(){
        let t = this
        t.address = window.address
    },
    
    dotrstype: function(){
        let t = this
        , oldtt = t.trstype
        t.trsfirstbtn = false
        setTimeout(function(){
            if (oldtt != t.trstype) {
                t.cointrs = []
                t.trspage = 0 // reset
            }
            t.domoretrs()
        }, 30);
    },

    domoretrs: function(){
        let t = this
        t.trsfirstbtn = false
        t.trspage++;
        let params = {
            page: t.trspage,
            limit: t.trslimit,
        }
        if(t.trstype=='in'){
            params.to = t.address
        }else if(t.trstype=='out'){
            params.from = t.address
        }else{ // all
            params.both = t.address
        }
        let rlamtwid = function(ty, amt) {
            if(ty == 1){
                let a = parseFloat(amt) / 100000000.0
                return 'ㄜ' + toThousands(a)
            }else if(ty == 2){
                let pr = parseFloat(amt)/1000000.0;
                return toThousands(amt) + ' SAT'
            }else if(ty == 3){
                let pr = toThousands(parseFloat(amt));
                return amt + ' HACD'
            }
            return amt
        }
        apiget("/api/actlogs/cointrs", params, function(data){
            let list = data.list || []
            , addrs = data.addrs
            , myaddr = t.address.substr(0,7) + '…'
            , my =  '<u class="my" title="'+t.address+'">'+myaddr+'</u>'
            for(let i in list){
                let li = list[i];
                li[1] = addrs[li[1]+'']
                li[2] = addrs[li[2]+'']
                if(li[1] == t.address){
                    li[1] =my
                }
                if(li[2] == t.address){
                    li[2] = my
                }
                // amt
                li[3] = rlamtwid(li[3], li[4])
            }
            if(!t.cointrs) {
                t.cointrs = []
            }
            t.cointrs = t.cointrs.concat(list)
            // show more
            t.trsifmore = list.length == t.trslimit ? true : false
        })
    },
    
    alldiamondnames: function(){
        let that = this
        apiget("/api/account/balance", {
            address: that.address,
        }, function(data){
            if(data && data.list.length > 0) {
                let dialist = data.list[0].diamonds
                , dias = "<i>"
                , dianum = 0;
                for(let i=0; i+6<=dialist.length; i+=6) {
                    if(i==0){
                        dias += dialist.substr(i, 6)
                    }else{
                        dias += "</i>,<i>" +dialist.substr(i, 6)
                    }
                    dianum ++;
                }
                that.all_diamond_names = dias + "</i>"
            }else{
                that.all_diamond_names = "-"
            }
        })
    },
    
    chdmsvsl: function(){
        let dms = this.ckvdmnas.replace(/[^WTYUIAHXVMEKBSZN\,]+/ig, "")
        dms = dms.replace(/^\,+|\,+$/ig, '')
        window.open('/diamond-views?name='+dms)
    },

    geTarIdJumpUrl(ty, id) {
        if( ty == 1 || ty == 2 ){
            return `/channel/${id}`
        }
        return '#'
    },

    loadoptlogs(){
        var that = this
        that.colpage ++ 
        that.colfirstbtn = false
        const optns = {'1': 'channel open', '2': 'channel close'}
        apiget("/api/actlogs/fiopts", {
            both: that.address,
            page: that.colpage,
            limit: that.collimit,
        }, function(data){
            let list = data.list || []
            , addrs = data.addrs
            , myaddr = that.address.substr(0,7) + '…'
            , my =  '<u class="my" title="'+that.address+'">'+myaddr+'</u>'
            // console.log(data)
            for(let i in list){
                let li = list[i]
                li[1] = addrs[li[1]+'']
                li[2] = addrs[li[2]+'']
                li[3] = optns[li[3]] || '~'
                if(li[1] == that.address){
                    li[1] = my
                    li[2] = '<a class="addr" target="_blank" href="/address/'+li[2]+'">'+li[2]+'</a>'
                }else if(li[2] == that.address){
                    li[1] = '<a class="addr" target="_blank" href="/address/'+li[1]+'">'+li[1]+'</a>'
                    li[2] = my
                }
            }
            if(!that.optlogs) {
                that.optlogs = []
            }
            that.optlogs = that.optlogs.concat(list)
            // more
            that.colifmore = data.length == that.collimit ? true : false
        })
    },

}, function(){
    this.init()
    // this.domoretrs()
});

