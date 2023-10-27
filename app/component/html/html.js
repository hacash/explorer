

function $id(id){
    return document.getElementById(id)
}


function $clas(a, n){
    return $class(a, n)[0]
}

function $class(a, n){
    if(!n){
        n = a
        a = document
    }
    return a.getElementsByClassName(n)
}

function $attr(a, n){
    return a.getAttribute(n)
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
function getStyle(obj, attr) 
{ 
    if(obj.currentStyle) 
    { 
        return obj.currentStyle[attr]; 
    } 
    else 
    { 
        return getComputedStyle(obj,false)[attr]; 
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
      var tpls = tpl.split('{:');
      fn.$ = "var $=''";
      for(var t = 0;t < tpls.length;t++){
          var p = tpls[t].split(':}');
          if(t!=0){
              fn.$ += '='==p[0].charAt(0)
                ? "+("+p[0].substr(1)+")"
                : ";"+p[0].replace(/\r\n/g, '')+"$=$"
          }
          // 支持 <pre> 和 [::] 包裹的 js 代码
          fn.$ += "+'"+p[p.length-1].replace(/\'/g,"\\'").replace(/\r\n/g, '\\n').replace(/\n/g, '\\n').replace(/\r/g, '\\n')+"'";
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
    if( r.data.result > 0 ) {
        return errcall && errcall(r.data.msg)
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


/////////////////////////////////


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


function toThousands(num) {
    return num.toString().replace(/\d+/, function(n) {
       return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    });
}
 