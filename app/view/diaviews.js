/**
 * 
 */

const http_tool = appload('tool/http')
const config = appload('config')


exports.components = [
    'header',

    'diaviews',

    'footer',
]



exports.datas = async function(query, callback, req, res)
{
    // console.log(query)
    // console.log(req.params)
    // 查询钻石可视化列表
    let page = parseInt(req.params.page)
    , limit = 200
    , curdianum = parseInt(req.query.curdianum)
    , maxpage =  parseInt(curdianum / limit) + 1
    , dianames = req.query.dianames || ""
    ;
    if(isNaN(page)){
        page = maxpage
    }
    let start = (page - 1) * limit + 1
    ;
    if(start > curdianum - limit + 1){
        start = curdianum - limit + 1
    }
    let diamond_view_gene_list = []
    try{
        let jsonobj = await http_tool.json(config.miner_api_url+"/query", {
            action: "getdiamondvisualgenelist",
            dianames: dianames,
            start_number: start,
            limit: limit,
            compress: 1,
        })
        let datas = jsonobj.list
        , len = datas.length
        , datalist = new Array(len)
        // console.log(JSON.stringify(jsonobj))
        // 倒序
        for(let i=0, k=len-1; i<len; i++, k--){
            let one = datas[i].split("|")
            datalist[k] = {
                "name": one[0],
                "number": one[1],
                "life_gene": one[2],
                "bid_fee": one[3],
            }
        }
        // console.log(jsonobj)
        diamond_view_gene_list = datalist
        
    }catch(e){
        console.log(e)
        diamond = "[error]" + e.toString()
    }
    // console.log(req.cookies)
    // 返回
    callback(null, {
        dvhip: req.cookies?parseInt(req.cookies.dvhip):undefined,
        pagetitle: "Hacash Diamond Pictures - page " + page,
        show_fee: !(req.query.no_fee),
        show_info: !(req.query.no_info),
        page: page,
        limit: limit,
        maxpage: maxpage,
        curdianum: curdianum,
        dianames: dianames || null,
        diamonds: diamond_view_gene_list,
    }, req, res)
}



