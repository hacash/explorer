
function $id(id){
    return document.getElementById(id)
}

function $clas(a, n){
    return $class(a, n)[0]
}

function $class(elm, name){
    if(!name){
        name = elm
        elm = document
    }
    return elm.getElementsByClassName(name)
}

function $attr(a, n){
    return a.getAttribute(n)
}


// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(), 
        "s+": this.getSeconds(), 
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) 
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


function table_to_list(table) {
    if(!table || !table.cols || table.cols.length == 0){
        return [] // empty
    }
   let list = []
   for(let r in table.rows){
       let row = table.rows[r]
       let obj = {}
       for(let i in table.cols){
           let k = table.cols[i]
           obj[k] = row[i]
       }
       list.push(obj)
   }
   return list
}

function getScrollTop() {  
    var scrollPos;  
    if (window.pageYOffset) {  
    scrollPos = window.pageYOffset; }  
    else if (document.compatMode && document.compatMode != 'BackCompat')  
    { scrollPos = document.documentElement.scrollTop; }  
    else if (document.body) { scrollPos = document.body.scrollTop; }   
    return scrollPos;   
}

function getStyle(obj, attr) { 
    if(obj.currentStyle) 
    { 
        return obj.currentStyle[attr]; 
    } 
    else 
    { 
        return getComputedStyle(obj,false)[attr]; 
    } 
} 

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
}

function setCookie (cname, cvalue, path, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    var path = "path=" + path;
    var ck = cname + "=" + cvalue + "; " + expires + "; " + path
    console.info(ck);
    document.cookie = ck;
    console.info(document.cookie);
}


function delurlquery(url, name) {
    url = url.replace( new RegExp("\\?"+name+"=[^&]*", 'ig'), '?')
        .replace(new RegExp("&"+name+"=[^&]*", 'ig'), '&')
        .replace(/[\?&]+$/ig, '')
    return url
}

function addurlquery(url, k, v) {
    var urls = delurlquery(url, k).split('#')
    , spmk = urls[0].indexOf('?')==-1 ? '?' : '&'
    urls[0] += spmk+k+'='+v
    return urls.join('#')
}



/////////////////////////////////////////////////


function tppl(tpl, data){
    var fn =  function(d) {
        var i, k = [], v = [];
        for (i in d) {
            k.push(i);
            v.push(d[i]);
        };
        return (new Function(k, fn.$)).apply(d, v);
    };
    if(!fn.$){
        var tpls = tpl.split('[:');
        fn.$ = "var $=''";
        for(var t = 0;t < tpls.length;t++){
            var p = tpls[t].split(':]');
            if(t!=0){
                fn.$ += '='==p[0].charAt(0)
                  ? "+("+p[0].substr(1)+")"
                  : ";"+p[0].replace(/\r\n/g, '')+"$=$"
            }
            // support <pre> & [::] wraped js code
            fn.$ += "+'"+p[p.length-1].replace(/'/g,"\\'").replace(/\r\n/g, '\\n').replace(/\n/g, '\\n').replace(/\r/g, '\\n')+"'";
        }
        fn.$ += ";return $;";
        // log(fn.$);
    }
    return data ? fn(data) : fn;
}


///////////////////////////////////////////////////////


function apicallex(r, okcall, errcall) {
    if( ! r.data ) {
        return errcall && errcall("cannot get data")
    }
    if( r.data.ret > 0 ) {
        return errcall && errcall(r.data.err, r.data)
    }
    okcall && okcall(r.data)
}

function apiget(url, data, okcall, errcall) {
    axios
        .get(url, {
            params: data,
        })
        .then(function(r){
            apicallex(r, okcall, errcall)
        })
        .catch(errcall)
}


function apipost(url, data, okcall, errcall) {
    axios
        .post(url, data)
        .then(function(r){
            apicallex(r, okcall, errcall)
        })
        .catch(errcall)
}

////////////////////////////////////




function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
};

function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}

//       toThousands
function toThousands(num) {
    return (num+'').replace(/\d+/, function(n) {
       return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    });
}
 


////////////////////////////////



const VueCreateAppCommon = function(id, data, methods, mounted) {
    let app = Vue.createApp({
        data() {
            return data
        },
        methods,
        mounted: mounted || function(){},
    });
    app.mount('#'+id);
    return app
};


