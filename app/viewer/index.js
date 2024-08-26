
    
exports.components = [
    'html',
    'header',

    'index',

    'footer',
    'tail',
]


exports.datas = async function(cnf, ctx)
{
    return {
        dvhip: ctx.cookies.get("dvhip")||undefined,
        title: null,
    }
}

    