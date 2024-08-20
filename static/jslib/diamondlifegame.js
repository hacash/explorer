/* HACD Game of life */


function CreateLifeGameInitialSVG(lifegenehex, wide, bkclr, notborder, nobkclr) {
    var gene = HEX_TO_U8ARY(lifegenehex)
    , points = U8ARY_TO_BITS(gene)
    ;


    var diamond_colors = [
        '#041B2D','#004E9A','#8A5082','#6F5F90','#8A5082','#FF7B89','#F7D6E0','#E5C1CD','#EFF7F6','#F3DBCF','#AAC9CE','#F2B5D4','#7BDFF2','#85CBCC','#F9E2AE','#daad7b'
        ]
    // var lifeptmaps = []
    // for(var i=0; i<16; i++){
    //     lifeptmaps.push(new Array(256))
    // }
    // for(var i=0; i<16; i++) {
    //     for(var k=0; k<16; k++){
    //         // var x = i*16 + k
    //         // lifeptmaps[i][k] = points[x]
    //     }
    // }

    // console.log(lifegenehex, gene, points)

    var perisk = 0
    function seekMaybe(per) {
        var gn = gene[perisk]
        // console.log(gn)
        perisk ++
        return gn % per == 1
    }

    var ptclrsk = 0
    function getPtClr(part1of4, i, k) {
        if( part1of4 && !(i*k==0 || i==15 || k==15) ) {
            return lifecolor
        }
        var cls = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple']
        , rtcl = cls[((i+1)*k+ptclrsk) % cls.length]
        ptclrsk ++
        return rtcl
    }

    // persent
    var perst1 = 11
    , perst2 = 21
    , perst3 = 41
    // var perst1 = 4
    // , perst2 = 4
    // , perst3 = 4;
    // style
    var backcolor = 'black'
    , lifecolor = 'green'
    , pointShape = 'rect'
    , enlarge = false
    , bkradius = false 
    , fullcolorful = false
    , partcolorful = false
    , irregular = false
    
    // point shape
    if(seekMaybe(perst1)) {
        pointShape = 'circle'
    }
    if(seekMaybe(perst1)) {
        pointShape = 'rhombus'
    }
    // if(seekMaybe(perst1)) {
    //     pointShape = 'rectcor'
    // }
    if(seekMaybe(perst3)) {
        pointShape = 'cube'
    }
    // life color
    if(seekMaybe(perst2)) {
        lifecolor = '#cd0b20' // red
    }
    if(seekMaybe(perst2)){
        partcolorful = true
    }
    if(seekMaybe(perst3)){
        fullcolorful = true
    }
    // transform
    if(seekMaybe(perst1)) {
        enlarge = true
        if(pointShape == 'rect'){
            pointShape = 'rectcor'
        }
    }
    if(seekMaybe(perst1)) {
        bkradius = true
    }
    // back color
    if(seekMaybe(perst1)) {
        backcolor = 'silver'
    }
    if(seekMaybe(perst2)) {
        backcolor = 'none' // no back
    }
    if(seekMaybe(perst3)) {
        backcolor = '#daad7b' // gold
        if(lifecolor == 'green'){
            lifecolor = bkclr // empty color
        }
    }
    if(seekMaybe(perst3)) {
        irregular = true
    }

    var border = notborder ? 0 : 10;
    backcolor = nobkclr ? "none" : backcolor;
    if(irregular){
        backcolor = bkclr || "#fff";
    }

    // draw SVG
    var ptdraws = []
    // background
    var bkradiuset = bkradius ? ' rx="20" ry="20" ' : ''
    ptdraws.push('<rect x="'+border+'" y="'+border+'" width="180" height="180" '+bkradiuset+' fill="'+backcolor+'" />') 
    // points
    function lifePtElm(ptdraws, ps, lg, fc, pc, i, k) {
        var point = ''
        , x = border+10 + i*10
        , y = border+10 + k*10
        , cx = x + 5
        , cy = y + 5
        ;
        
        switch(ps) {
        case 'cube':
            var sr = 4
            , srd = sr * 2
            , p1 = (x-sr)+','+(y-sr)
            , p2 = (x+sr)+','+(y-sr)
            , p3 = (x-sr)+','+(y+sr)
            , p4 = (x+sr)+','+(y+sr)
            , p5 = (x+srd)+','+(y)
            , p6 = (x+srd)+','+(y+srd)
            , p7 = (x)+','+(y+srd)
            ;
            ptdraws.push('<polygon points="'+p2+' '+p5+' '+p6+' '+p4+'" fill="#10b310" />')
            ptdraws.push('<polygon points="'+p3+' '+p7+' '+p6+' '+p4+'" fill="#015801" />')
            point = '<polygon points="'+p1+' '+p2+' '+p4+' '+p3+'" '
            break
        case 'rect':
        case 'rectcor':
            var wd = 10
            , r = 3
            if(lg) {
                wd = 15
                x -= 2.5
                y -= 2.5
                r = 5
            }
            var rcor = ps=='rectcor' ? ' rx="'+r+'" ry="'+r+'" ' : ''
            point = '<rect x="'+x+'" y="'+y+'" width="'+wd+'" height="'+wd+'" ' + rcor
            break
        case 'circle':
            var r = 4
            if(lg) {
                r = 7
            }
            point = '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'"'
            break
        case 'rhombus':
            var d = 6
            if(lg) {
                d = 9
            }
            var p1 = cx+','+(cy-d)
            , p2 = (cx+d)+','+cy
            , p3 = cx+','+(cy+d)
            , p4 = (cx-d)+','+cy
            point = '<polygon points="'+p1+' '+p2+' '+p3+' '+p4+'"'
            break
        }
        var lfclr = lifecolor
        if(pc||fc) {
            lfclr = getPtClr(pc, i, k)
        }
        return point + ' fill="'+lfclr+'" />'
    }
    for(var i=0; i<16; i++) {
        for(var k=0; k<16; k++){
            var x = i*16 + k
            , has = points[x]
            if(has){
                ptdraws.push( lifePtElm(ptdraws, pointShape, enlarge, fullcolorful, partcolorful, i, k) )
            }
        }
    }

    // irregular background
    var irrstyle = ''
    var irrbackground = ''
    if(irregular) {
        irrstyle = 'style="transform: scale(0.66666666667); transform-origin: center;"'
        irrbackground = '<g>'
        var rainbows = diamond_colors
        , rr = 200
        , cx = [0,200][gene[31]%2]
        , cy = [0,200][gene[30]%2]
        rainbows = gene[29]%2 ? rainbows : rainbows.reverse()
        function drawone(rr, cl) {
            return  '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rr+'" ry="'+rr+'" fill="'+cl+'"/>'
        }
        for(var i in rainbows) {
            var cl = rainbows[i]
            rr = 200 - (i*7)
            irrbackground += drawone(rr, cl)
        }
        rr -= 7
        irrbackground += drawone(rr, backcolor) + '</g>'
    }


    // console.log(ptdraws)

    // ret SVG
    var colorful = null
    if(partcolorful) {
        colorful = 'part'
    }
    if(fullcolorful) {
        colorful = 'full'
    }
    var vnw = notborder ? 180 : 200
    if(irregular){
        bkclr = "#fff";
    }
    var rainbow_bgc = irregular ? backcolor : 'none'
    return ['<svg class="dvhip9" version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+vnw+' '+vnw+'" width="'+wide+'" height="'+wide+'" style="background: '+rainbow_bgc+';">'+irrbackground+'<g '+irrstyle+'>'+ptdraws.join('')+'</g></svg>',
    // config parkage
    {
        gene: gene,
        points: points,
        background: backcolor, // none
        lifecolor: lifecolor,
        colorful: colorful,
        irregular: irregular,
        // pointshape: pointShape,
    }]
}

/*

*/
function StartPlayLifeGame(wrapelm, lgcnf, lifewidth, steptime, backclr) {

    if(lgcnf.background == 'none'){
        lgcnf.background = null
    }

    // canvas
    var bkwide = lifewidth * 256
    , bkstyles = 'width:'+bkwide+'px; height:'+bkwide+'px; '
    , backcolor = lgcnf.background || backclr || '#000'
    ;
    // bkstyles += 'background: '+backcolor+';';

    wrapelm.innerHTML = '<canvas class="lgcvs" id="lgcvs" width="'+bkwide+'" height="'+bkwide+'" style="'+bkstyles+'"></canvas><div id="lgret"></div>'

    console.log(lgcnf)

    var lifecolorfn = function (i, k){
        var cls = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple']
        if(lgcnf.colorful){
            if(lgcnf.colorful == 'part' && !(i<85||i>170||k<85||k>170)){
                return lgcnf.lifecolor
            }
            rtcl = cls[(i*k+i+k) % cls.length]
            return rtcl
        }else{
            return lgcnf.lifecolor
        }


    }

    // play
    // draw
    var ctx = document.getElementById("lgcvs").getContext("2d");
    var ret = document.getElementById("lgret")

    var mapwide = 256
    , lifeptmaps = []

    // init
    function initLifes() {
        var lifeptmaps_new = []
        for(var i=0; i<mapwide; i++){
            lifeptmaps_new.push(new Array(256))
        }
        for(var i=0; i<16; i++) {
            for(var k=0; k<16; k++){
                var x = i*16 + k
                lifeptmaps_new[120+i][120+k] = lgcnf.points[x]
            }
        }
        lifeptmaps = lifeptmaps_new
    }
    initLifes();

    // count
    var lifeareamaps = {}
    , lifeareaCounts = 0
    , lifetimesCount = 0
    ;
    
    function clearMaps() {
        ctx.fillStyle = backcolor;
        console.log(backcolor)
        ctx.fillRect(0,0,mapwide*lifewidth,mapwide*lifewidth);
    }

    function drawLifes(lifeptmaps) {
        ctx.fillStyle = lifecolorfn(1,1);
        var lifepts = 0
        ;
        for(var i=0; i<mapwide; i++) {
            var li = lifeptmaps[i]
            , ls = i * lifewidth
            for(var k=0; k<mapwide; k++) {
                var alive = li[k]
                if(alive) {
                    lifepts += 1
                    var ak = i+','+k
                    if(lifeareamaps[ak]) {
                        lifeareamaps[ak] += 1
                    }else{
                        lifeareamaps[ak] = 1
                        lifeareaCounts += 1 // area
                    }
                    // console.log(i, k)
                    var ts = k * lifewidth
                    ctx.fillStyle = lifecolorfn(i,k);
                    ctx.fillRect(ls,ts,lifewidth,lifewidth);
                }
            }
        }
        return [lifepts, lifeareaCounts]
    }

    function drawLifeArea(lifeareamaps) {
        ctx.fillStyle = '#088';
        var arealifepts = 0
        , reptlifepts = 0;
        for(var k in lifeareamaps) {
            var avdp = lifeareamaps[k]
            reptlifepts += avdp
            arealifepts++
            var lt = k.split(',')
            , l = parseInt(lt[0])
            , t = parseInt(lt[1])
            , w = lifewidth
            // console.log(l,t)
            avdp += 25
            if(avdp > 255) {
                avdp = 255
            }
            // console.log('rgb(25,25,'+avdp+')')
            ctx.fillStyle = 'rgb('+avdp+',25,25)';
            ctx.fillRect(l*w,t*w,w,w);
        }
        return [reptlifepts, arealifepts]
    }

    clearMaps()
    drawLifes(lifeptmaps)

    // alive_check
    function alive_check_one(lifeptmaps, i, k, max) {
        // console.log(i, k, max)
        var l = i-1
        , t = k-1
        , alive_count = 0
        for(var a=l; a<l+3; a++){
            if(a<0 || a>=max) continue;
            for(var b=t; b<t+3; b++){
                if(b<0 || b>=max) continue;
                if(a==i&&b==k) continue;
                if(lifeptmaps[a][b]) {
                    alive_count++
                }
            }
        }
        return alive_count
    }

    // fresh_next
    function fresh_to_next(lifeptmaps) {
        // console.log(lifeptmaps)
        // new empty
        var lifeptmaps_new = []
        for(var i=0; i<mapwide; i++){
            lifeptmaps_new.push(new Array(256))
        }
        // check
        for(var i=0; i<mapwide; i++) {
            for(var k=0; k<mapwide; k++){
                var sta = lifeptmaps[i][k]
                , acs = alive_check_one(lifeptmaps, i, k, mapwide)
                , islife = 0
                if(acs==3 || (sta&&(acs==2))) {
                    // console.log('isalive', i, k)
                    islife = 1 // alive
                }
                lifeptmaps_new[i][k] = islife
                // console.log(sta, acs, islife)
            }
        }
        // set update
        return lifeptmaps_new
    }


    // do move

    var doStopToCount = false
    , prev_life_counts = null
    , prev_life_repeat = 0
    function go_next_life() {
        lifeptmaps = fresh_to_next(lifeptmaps)
        // console.log(lifeptmaps)
        clearMaps()
        var counts = drawLifes(lifeptmaps)
        , pcs = prev_life_counts
        // if end
        if(pcs && pcs[0]==counts[0] && pcs[1]==counts[1]){
            // console.log(counts, pcs)
            // console.log('repeat: '+prev_life_repeat+', stop: ' + pcs[0] +', '+pcs[1])
            prev_life_repeat += 1
        }else{
            prev_life_repeat = 0
        }
        if(prev_life_repeat >= 10){
            doStopToCount = true
            clearTimeout(loop_timer)
            stopCount()
            return
        }

        // counts
        prev_life_counts = counts
    }


    // for(var i=0; i<10; i++){
    //     // go_next_life()
    // }

    // loop
    var loop_timer = null
    function loop(){
        if(doStopToCount) {
            return
        }
        lifetimesCount += 1
        go_next_life()
        loop_timer = setTimeout(loop, steptime)
    }
    // loop()
    loop_timer = setTimeout(loop, 1000)
    // setInterval(go_next_life, steptime)

    // stop count
    function stopCount() {
        doStopToCount = true
        clearTimeout(loop_timer)
        // counts
        var lifepts = 0
        , edgelifepts = 0
        , arealifepts = 0;
        for(var i=0; i<mapwide; i++) {
            for(var k=0; k<mapwide; k++) {
                var edge = i==0 || i==mapwide-1 ||
                    k==0 || k==mapwide-1
                var alive = lifeptmaps[i][k]
                if(alive) {
                    // lifepts += 1
                    if(edge){
                        edgelifepts += 1
                    }
                }                                
            }   
        }


        areacounts = drawLifeArea(lifeareamaps)
        lifecounts = drawLifes(lifeptmaps)
        
        // result
        ret.innerText = 
            'Vitality: '+areacounts[0]+', Territory: '+areacounts[1]+', Times: '+lifetimesCount+', Living: '+lifecounts[0]+', Expedition: '+edgelifepts
        ret.style.opacity = 1;
        // console.log(arealifepts, lifepts, edgelifepts)

    }





}


/*

普通样式：黑底绿点

1. 第一级概率  1/10
  - 灰色背景
  - 圆角背景
  - 圆点
  - 菱形◇点

2. 第二级概率  1/20
  - 无背景    
  - 点放大
  - 边缘彩色
  - 红色

3. 第三级概率  1/40
  - 金色镂空  
  - 全彩色
  - 立体方块   
  - 不规则背景

*/
