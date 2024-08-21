
;VueCreateAppCommon('header', {
    search_str: "",
},{
    choiseLang(lang) {
        setCookie("lang", lang, "/", 1000) 
        window.location.href += "" 
    },
    keyEnterSearch(e) {
        if(e.key=="Enter"){
            this.clickSearch()
        }
    },
    clickSearch() {
        let t = this
        , ss = t.search_str
        doHeaderSearch(ss)
    }
});


function doHeaderSearch(ss) {
    ss = ss.replace(/\s+/i,'')
    if (ss) {
        if (ss.replace(/[WTYUIAHXVMEKBSZN\,]+/ig, "")=="") {
            if(ss.length == 6){
                // alert("钻石字面值")
                window.open('/diamond/'+ss)
            }else if(ss.length >= 6 + 1 + 6){
                // alert("钻石列表")
                window.open('/diaviews?dianames='+ss)
            }
        }else if( ss[0]=="#" && parseInt(ss.substr(1)) > 0){
            // alert("钻石序号")
            window.open('/diamond/'+ss.substr(1))
        }else if (parseInt(ss) > 0 && ss.replace(/[0-9]+/,'')=='') {
            // alert("区块高度")
            window.open('/block/'+ss)
        }else if (ss.replace(/[0-9a-fA-F]+/gi,'')=='') {
            if (ss.length==2*16) {
                // alert("通道id")
                window.open('/channel/'+ss)
            }else if (ss.length==2*18) {
                // alert("线性锁仓合约")
                window.open('/lockbls/'+ss)
            }else if (ss.length==2*14) {
                // alert("钻石系统借贷")
                window.open('/hacdlend/'+ss)
            }else if (ss.length==2*15) {
                // alert("比特币系统借贷")
                window.open('/btclend/'+ss)
            }else if (ss.length==2*17) {
                // alert("钻石和比特币用户借贷")
                window.open('/usrlend/'+ss)
            }else if (ss.length==2*32) {
                if(ss.substr(0,4)=='0000'){
                    // alert("区块哈希")
                    window.open('/block/'+ss)
                }else{
                    // alert("交易hx")
                    window.open('/tx/'+ss)
                }
            }
         }else if (ss.length>=31&&ss.length<=34) {
            // alert("账户地址")
            window.open('/address/'+ss)
        }else{
            alert("Unrecognized query content!")
        }
        
    }
}

// dvhipck
;(function(){

    var ds = $clas('dvhipck')
    if(!ds) return;
    // toggle
    var toggle = function(e) {
        var dvhip = $attr(this, 'dvhip')
        setCookie('dvhip', dvhip, '/', 30)
        location.reload()
    }
    // console.log(ds)
    var as = $clas(ds, 'hipit');
    // console.log(as)
    for(var i=0; i<as.length; i++){
        // console.log(as[i])
        as[i].onclick = toggle
    }
    // chrome tip
    var ua = window.navigator.userAgent
    // console.log(ua)
    var bn = "Chrome"
    , bnn = ua.indexOf(bn)
    , isOk = bnn > -1
    ;
    if(isOk) {
        var si = bnn + bn.length + 1
        , vi = parseFloat(ua.slice(si, si+3))
        ;
        // console.log(vi)
        if(vi < 100) {
            isOk = false //not ok
        }
    }
    if(!isOk) {
        var ts = $clas(ds, 'browsertip')
        if(ts.length){
            ts[0].style.display = 'block';
        }
    }

})();


