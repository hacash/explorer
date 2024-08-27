

var svgs = document.getElementsByClassName("svg")
for(var i=0; i<svgs.length; i++){
    var li = svgs[i]
    , lgene = li.getAttribute("lgene")
    , dianm = li.getAttribute("dianm")
    , vgene = DiamondLifeGeneConvertVisualGene(lgene, dianm)
    var backcl = theme == 2 ? 'black' : 'white';
    if(dvhip==5){
        li.innerHTML = CreateDiamondImageTagSVG(vgene, 200)
    }
    if(dvhip==8){
        li.innerHTML = CreateDiamondBrillianceSVG(vgene, 200, backcl)
    }
    if(dvhip==9){
        li.innerHTML = CreateLifeGameInitialSVG(lgene, 180, backcl)[0]
    }
        
}


