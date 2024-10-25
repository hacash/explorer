

let diamond = $id("diamond")

let lgene = dia_life_gene
, dianm = dia_name
, dianb = dia_number
, vgstr = DiamondLifeGeneConvertVisualGene(lgene, dianm)
;

// card
(function(){

    let ista = function(str, a,  xs) {
        let s = []
        let k=0
        for(let i=0; i<str.length; i++){
            s.push(str.substr(i,1))
            if(i==xs[k]-1) {
                s.push(a)
                k++
            }
        }
        return s.join('')
    }

    let card = $id('card')
    , showbig = $id('showbigcard')
    , cdcon = $clas(card, 'cdcon')
    , ibg = $clas(card, 'ibg')
    , img = $clas(card, 'img')
    , ch = parseInt(cdcon.offsetHeight)
    , mcl = GetDiamondMainColor(vgstr)
    , imgsvg = CreateDiamondImageTagSVG(vgstr, ch)
    , bgc = "linear-gradient(to right bottom, #"+mcl[0]+"99, #"+mcl[1]+")"
    cdcon.style.backgroundImage = bgc

    ibg.innerHTML = imgsvg + (function(){
        let cls = new Array(32);
        for(let i=0;i<16;i++){
            let c = DiamondImageColorListDefs[i]
            , k = i+1
            cls[i] = `--dccr-${k}:#${c[0]}`
            cls[i+16] = `--dccr-${k+16}:#${c[1]}`
        }
        return `<style>:root{${cls.join(';')};}</style>`
    })() + (function(){
        let cls = GetDiamondMainColor(vgstr, 16)
        for(let i=0;i<16;i++){
            let c = cls[i]
            , k = i+1
            cls[i] = `--diacl-${k}:#${c[0]};`
                + `--diacl2-${k}:#${c[1]}`
        }
        return `<style>:root{${cls.join(';')};}</style>`

    })();
    img.innerHTML = imgsvg

    // hip8
    let h8w = $clas(card, 'h8')
    , h8svg = CreateDiamondBrillianceSVG(vgstr, ch/4, "#ffffff66")
    h8w.innerHTML = h8svg

    // hip9
    let h9w = $clas(card, 'h9')
    , h9svg = CreateLifeGameInitialSVG(lgene, ch/5, null, true, true)[0]
    h9w.innerHTML = h9svg

    // meta

    // lg
    let vlg = ista(lgene, '<br>', [8,16,24,32,40,48,56])
    , lg = $clas(card, 'lg')
    lg.innerHTML = vlg  
    lg.style.backgroundImage = (function(){
        let sts = []
        for(let i=0;i<15;i++){
            let l = i*(100/16)
            , k = i
            sts.push(`var(--diacl-${k+1}) ${l}%,transparent ${l}%,transparent ${l+1}%,var(--diacl-${k+2}) ${l+1}%`)
        }
        return "linear-gradient(-21deg,"+sts.join(',')+")"
    })();

    // vg
    let vvg = ista(vgstr, ' ', [2,6,10,14,18]).toUpperCase()
    , vg = $clas(card, 'vg')
    , vgsx = vvg.split('')
    if(vgsx[0]==0 && vgsx[1]>=1 && vgsx[1]<=8) {
        vgsx[0] = `<span style="color:#${mcl[0]};">${vgsx[0]}</span>`
        vgsx[1] = `<span style="color:#${mcl[1]};">${vgsx[1]}</span>`
    }
    vgsx[23] = `<span style="color:#ffffff33;">${vgsx[23]}${vgsx[24]}</span>`
    vgsx[24] = '' // delete
    vg.innerHTML = vgsx.join('')

    // dn 
    let dn = $clas(card, 'dn')
    dn.style.backgroundImage = `linear-gradient(90deg,
        var(--diacl-1), var(--diacl2-1), 
        var(--diacl-2), var(--diacl2-2), 
        var(--diacl-3), var(--diacl2-3), 
        var(--diacl-4), var(--diacl2-4),
        var(--diacl-5), var(--diacl2-5),
        var(--diacl-6), var(--diacl2-6)
        )`

    // ldz 
    let ldz = $clas(card, 'ldz')
    , ldzbsz = 48.0 * ((100001.0 - dianb) / 100000.0)
    ldz.style.backgroundSize = `${ldzbsz}px ${ldzbsz}px`

    // clb 
    let clb = $clas(card, 'clb')
    clb.style.backgroundImage = (function(){
        let sts = []
        for(let i=0;i<15;i++){
            let l = i*(100/16)+6
            , k = i
            sts.push(`var(--diacl2-${k+1}) ${l}%,transparent ${l}%,transparent ${l+1}%,var(--diacl2-${k+2}) ${l+1}%`)
        }
        return "linear-gradient(135deg,"+sts.join(',')+")"
    })();

    // cll
    let cll = $clas(card, 'cll')
    cll.style.backgroundImage = `linear-gradient(0deg,
        var(--diacl-15), var(--diacl2-15), 
        var(--diacl-13), var(--diacl2-13), 
        var(--diacl-14), var(--diacl2-14), 
        var(--diacl-16), var(--diacl2-16) 
        )`

    // font
    /*
    setTimeout(function(){
        let ftst = document.createElement('div')
        ftst.innerHTML = `
        <link href="https://fonts.googlefonts.cn/css?family=Share+Tech+Mono|VT323" rel="stylesheet" />
        `
        document.body.appendChild(ftst)
    }, 12);
    */

    let fullbig_cn = 'fullbig'
    showbig.onclick = function(){
        card.classList.add(fullbig_cn)
        let s1 = parseFloat(window.innerWidth) / 800.0
        let s2 = parseFloat(window.innerHeight) / 500.0
        if(s1 > s2){
            s1 = s2
        }
        $clas(card, "cdit").style.transform = `scale(${s1})`
    }
    card.onclick = function() {
        card.classList.remove(fullbig_cn)
        $clas(card, "cdit").style.transform = `scale(1)`
    }

})();

function doSaveFile(value, type, name) {
    let blob;
    if (typeof window.Blob == "function") {
        blob = new Blob([value], {type: type});
    } else {
        let BlobBuilder = window.BlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder;
        let bb = new BlobBuilder();
        bb.append(value);
        blob = bb.getBlob(type);
    }
    let URL = window.URL || window.webkitURL;
    let bloburl = URL.createObjectURL(blob);
    let anchor = document.createElement("a");
    if ('download' in anchor) {
        anchor.style.visibility = "hidden";
        anchor.href = bloburl;
        anchor.download = name;
        document.body.appendChild(anchor);
        let evt = document.createEvent("MouseEvents");
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

    let diaimg = $id("diaimg")
    , sbp = $id("showbigimg")
    , dlsvg = $id("downloadsvg")
    
    let lgene = $attr(diaimg, "life_gene")
    , dianm = $attr(diaimg, "dia_name")
    , vgstr = DiamondLifeGeneConvertVisualGene(lgene, dianm)
    let svgtag = CreateDiamondImageTagSVG(vgstr, 600)

    diaimg.innerHTML = svgtag

    // 查看高清大图
    function showbigpic(){
        sbp.getElementsByTagName("div")[0].innerHTML = CreateDiamondImageTagSVGFullShow(vgstr)
    }
    sbp.onclick = showbigpic
    // showbigpic();

    // 下载SVG格式图片
    function downloadsvg(){
        let fn = diaimg.getAttribute("savefilename")
        , svgcon = diaimg.getElementsByTagName("svg")[0].innerHTML
        , filecon = '<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 25.4.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="125 100 500 500" xml:space="preserve"> <style type="text/css"> .st16 { fill: none; stroke: #F5E1DA; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; stroke-miterlimit: 10; } </style>' + svgcon + '</svg>';
        doSaveFile(filecon, "image/svg+xml", fn+".svg")
    }
    dlsvg.onclick = downloadsvg
})();


// HIP-8
;(function(){

    let diaimg = $id("hip8img")
    , lgene = $attr(diaimg, "life_gene")
    , dianm = $attr(diaimg, "dia_name")
    , vgstr = DiamondLifeGeneConvertVisualGene(lgene, dianm)
    , backcl = theme == 2 ? 'black' : 'white'
    , svgtag = CreateDiamondBrillianceSVG(vgstr, 800, backcl)
    ;

    let showbighip8 = document.getElementById("showbighip8")

    diaimg.innerHTML = svgtag;

    showbighip8.onclick = function(){
        // console.log(svgtag)
        // window.history.pushState({}, 'Big picture')
        let bd = document.body
        bd.innerHTML = '<div style="width: 1200px; margin: auto">'+CreateDiamondBrillianceSVG(vgstr, 1200, "black")+'</div>'
        bd.style.backgroundColor = "black"
    }


})();



// HIP-9
;(function(){

    let diaimg = $id("hip9img")
    , lgene = $attr(diaimg, "life_gene")
    , backcl = theme == 2 ? 'black' : 'white'
    , lifgameobj = CreateLifeGameInitialSVG(lgene, 800, backcl, true) // not border
    , lgsvgtag = lifgameobj[0]
    , lgcnf = lifgameobj[1]
    ;

    diaimg.innerHTML = lgsvgtag;

    let playlg1 = $id("playlg")
    , playlg2 = $id("playlgbtn")
    , hip9wrap = $clas("hip9wrap")
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
    //     let bd = document.body
    //     bd.innerHTML = '<div style="width: 1200px; margin: auto">'+CreateDiamondBrillianceSVG(vgstr, 1200, "black")+'</div>'
    //     bd.style.backgroundColor = "black"
    // }


})();
