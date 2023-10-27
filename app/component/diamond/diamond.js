
var diamond = $id("diamond")

var lgene = $attr(diamond, "life_gene")
, dianm = $attr(diamond, "dia_name")
, vgstr = DiamondLifeGeneConvertVisualGene(lgene, dianm)
;

// card
(function(){

    var ista = function(str, a,  xs) {
        var s = []
        var k=0
        for(var i=0; i<str.length; i++){
            s.push(str.substr(i,1))
            if(i==xs[k]-1) {
                s.push(a)
                k++
            }
        }
        return s.join('')
    }

    var card = $id('card')
    , cdcon = $clas(card, 'cdcon')
    , ibg = $clas(card, 'ibg')
    , img = $clas(card, 'img')
    , ch = parseInt(cdcon.offsetHeight)
    , mcl = GetDiamondMainColor(vgstr)
    , imgsvg = CreateDiamondImageTagSVG(vgstr, ch)
    , bgc = "linear-gradient(to right bottom, #"+mcl[0]+"99, #"+mcl[1]+")"
    cdcon.style.backgroundImage = bgc

    ibg.innerHTML = imgsvg + (function(){
        var cls = new Array(32);
        for(var i=0;i<16;i++){
            var c = DiamondImageColorListDefs[i]
            , k = i+1
            cls[i] = `--dccr-${k}:#${c[0]}`
            cls[i+16] = `--dccr-${k+16}:#${c[1]}`
        }
        return `<style>:root{${cls.join(';')};}</style>`
    })() + (function(){
        var cls = GetDiamondMainColor(vgstr, 16)
        for(var i=0;i<16;i++){
            var c = cls[i]
            , k = i+1
            cls[i] = `--diacl-${k}:#${c[0]};`
                + `--diacl2-${k}:#${c[1]}`
        }
        return `<style>:root{${cls.join(';')};}</style>`

    })();
    img.innerHTML = imgsvg

    // hip8
    var h8w = $clas(card, 'h8')
    , h8svg = CreateDiamondBrillianceSVG(vgstr, ch/4, "#ffffff66")
    h8w.innerHTML = h8svg

    // hip9
    var h9w = $clas(card, 'h9')
    , h9svg = CreateLifeGameInitialSVG(lgene, ch/5, null, true, true)[0]
    h9w.innerHTML = h9svg

    // meta

    // lg
    var vlg = ista(lgene, '<br>', [8,16,24,32,40,48,56])
    , lg = $clas(card, 'lg')
    lg.innerHTML = vlg  
    lg.style.backgroundImage = (function(){
        var sts = []
        for(var i=0;i<15;i++){
            var l = i*(100/16)
            , k = i
            sts.push(`var(--diacl-${k+1}) ${l}%,transparent ${l}%,transparent ${l+1}%,var(--diacl-${k+2}) ${l+1}%`)
        }
        return "linear-gradient(-21deg,"+sts.join(',')+")"
    })();

    // vg
    var vvg = ista(vgstr, ' ', [2,6,10,14,18]).toUpperCase()
    , vg = $clas(card, 'vg')
    vg.innerHTML = vvg  

    // dn 
    var dn = $clas(card, 'dn')
    dn.style.backgroundImage = `linear-gradient(90deg,
        var(--diacl-15), var(--diacl2-15), 
        var(--diacl-13), var(--diacl2-13), 
        var(--diacl-14), var(--diacl2-14), 
        var(--diacl-16), var(--diacl2-16) 
        )`


    // clb 
    var clb = $clas(card, 'clb')
    clb.style.backgroundImage = (function(){
        var sts = []
        for(var i=0;i<15;i++){
            var l = i*(100/16)+6
            , k = i
            sts.push(`var(--diacl2-${k+1}) ${l}%,transparent ${l}%,transparent ${l+1}%,var(--diacl2-${k+2}) ${l+1}%`)
        }
        return "linear-gradient(135deg,"+sts.join(',')+")"
    })();

    // cll
    var cll = $clas(card, 'cll')
    cll.style.backgroundImage = `linear-gradient(0deg,
        var(--diacl-15), var(--diacl2-15), 
        var(--diacl-13), var(--diacl2-13), 
        var(--diacl-14), var(--diacl2-14), 
        var(--diacl-16), var(--diacl2-16) 
        )`



    // font
    /*
    setTimeout(function(){
        var ftst = document.createElement('div')
        ftst.innerHTML = `
        <link href="https://fonts.googlefonts.cn/css?family=Share+Tech+Mono|VT323" rel="stylesheet" />
        `
        document.body.appendChild(ftst)
    }, 12);
    */

})();

function doSaveFile(value, type, name) {
    var blob;
    if (typeof window.Blob == "function") {
        blob = new Blob([value], {type: type});
    } else {
        var BlobBuilder = window.BlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder;
        var bb = new BlobBuilder();
        bb.append(value);
        blob = bb.getBlob(type);
    }
    var URL = window.URL || window.webkitURL;
    var bloburl = URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    if ('download' in anchor) {
        anchor.style.visibility = "hidden";
        anchor.href = bloburl;
        anchor.download = name;
        document.body.appendChild(anchor);
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, true);
        anchor.dispatchEvent(evt);
        document.body.removeChild(anchor);
    } else if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, name);
    } else {
        location.href = bloburl;
    }
}

// HIP-5
;(function(){

    var diaimg = document.getElementById("diaimg")
    var sbp = document.getElementById("showbigimg")
    var dlsvg = document.getElementById("downloadsvg")
    
    var lgene = diaimg.getAttribute("life_gene")
    , dianm = diaimg.getAttribute("dia_name")
    , vgstr = DiamondLifeGeneConvertVisualGene(lgene, dianm)
    var svgtag = CreateDiamondImageTagSVG(vgstr, 600)

    diaimg.innerHTML = svgtag

    // 查看高清大图
    function showbigpic(){
        sbp.getElementsByTagName("div")[0].innerHTML = CreateDiamondImageTagSVGFullShow(vgstr)
    }
    sbp.onclick = showbigpic
    // showbigpic();

    // 下载SVG格式图片
    function downloadsvg(){
        var fn = diaimg.getAttribute("savefilename")
        , svgcon = diaimg.getElementsByTagName("svg")[0].innerHTML
        , filecon = '<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 25.4.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="125 100 500 500" xml:space="preserve"> <style type="text/css"> .st16 { fill: none; stroke: #F5E1DA; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; stroke-miterlimit: 10; } </style>' + svgcon + '</svg>';
        doSaveFile(filecon, "image/svg+xml", fn+".svg")
    }
    dlsvg.onclick = downloadsvg
})();


// HIP-8
;(function(){

    var diaimg = document.getElementById("hip8img")
    , lgene = diaimg.getAttribute("life_gene")
    , dianm = diaimg.getAttribute("dia_name")
    , vgstr = DiamondLifeGeneConvertVisualGene(lgene, dianm)
    , backcl = theme == 2 ? 'black' : 'white'
    , svgtag = CreateDiamondBrillianceSVG(vgstr, 800, backcl)
    ;

    var showbighip8 = document.getElementById("showbighip8")

    diaimg.innerHTML = svgtag;

    showbighip8.onclick = function(){
        // console.log(svgtag)
        // window.history.pushState({}, 'Big picture')
        var bd = document.body
        bd.innerHTML = '<div style="width: 1200px; margin: auto">'+CreateDiamondBrillianceSVG(vgstr, 1200, "black")+'</div>'
        bd.style.backgroundColor = "black"
    }


})();



// HIP-9
;(function(){

    var diaimg = document.getElementById("hip9img")
    , lgene = diaimg.getAttribute("life_gene")
    , backcl = theme == 2 ? 'black' : 'white'
    , lifgameobj = CreateLifeGameInitialSVG(lgene, 800, backcl, true) // not border
    , lgsvgtag = lifgameobj[0]
    , lgcnf = lifgameobj[1]
    ;

    diaimg.innerHTML = lgsvgtag;

    var playlg1 = document.getElementById("playlg")
    , playlg2 = document.getElementById("playlgbtn")
    , hip9wrap = document.getElementsByClassName("hip9wrap")[0]
    , playLifeGame = function() {
        diaimg.style.background = lgcnf.background||'none'
        playlg1.style.display = 'none'
        diaimg.classList.add('plrd')

        setTimeout(function(){
            StartPlayLifeGame(hip9wrap, lgcnf, 3, 5, backcl)
        }, 1000)

    }

    playlg1.onclick = playLifeGame;
    playlg2.onclick = playLifeGame;


    // showbighip8.onclick = function(){
    //     // console.log(svgtag)
    //     // window.history.pushState({}, 'Big picture')
    //     var bd = document.body
    //     bd.innerHTML = '<div style="width: 1200px; margin: auto">'+CreateDiamondBrillianceSVG(vgstr, 1200, "black")+'</div>'
    //     bd.style.backgroundColor = "black"
    // }


})();
