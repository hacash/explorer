/**
 *
 */

const fs = require('fs')
const path = require('path')

const mysql = require('mysql');

const routes = require('./routes.js');
const viewer = require('./viewer.js');
const config = require('../config.js');

const toolfs = require('./tool/fs.js')


module.exports = function(app)
{
    // lang
    app.use(function(req, res, next){
        let ty = config.lang || 'en'
          , langset
        if(req.cookies){
            ty = res.lang_type = req.cookies.lang || ty
            if(req.cookies.lang) {
                langset = req.cookies.lang
            }
        }
        res.lang = loadLanguage(ty)
        res.lang.useset = ty
        res.lang_manual_selection = langset // 表示手动选择的语言设定
        // console.log(res.lang)
        next()
    })
    // theme
    app.use(function(req, res, next){
        let themeset = config.theme || '1' // 1:white  2:black
        if(req.cookies){
            if(req.cookies.theme) {
                themeset = req.cookies.theme
            }
        }
        res.theme = themeset
        next()
    })
    // routes
    for(let i in routes){
        var isPost = false
        if(i.startsWith('POST')){
            isPost = true
        }
        const ctrl = require('./controller/'+routes[i]+'.js')
        if (isPost){
            i = i.substr(4)
            app.post(i, ctrl)
        }else{
            app.get(i, ctrl)
        }
    }
    // views compile
    viewer.compile({})
}


// 加载语言
const languageDefType = "en"
const languageSupport = {'en':true,'zh':true}
const loadLanguageCache = {}
function loadLanguage(type) {
    if(!languageSupport[type]) {
        type = languageDefType
    }
    if( loadLanguageCache[type] ) {
        return loadLanguageCache[type] 
    }
    const langs = {}
    let folders = loadLanguageItem(langs, './language/'+type)
    for(let i in folders){
        let one = folders[i]
        , bsk = path.basename(one).replace('.js', '')
        loadLanguageItem(langs, one, bsk)
    }
    // console.log(langs)
    loadLanguageCache[type] = langs
    return langs
}
function loadLanguageItem(langs, dir, bsk) {
    const flist = toolfs.scan(dir)
    for(let i in flist.files){
        let one = flist.files[i]
        , key = path.basename(one).replace('.js', '')
        , lobj = require(one.replace('./language/', '../language/'))
        // console.log('files', i, key, one)
        if(bsk){
            langs[bsk] = langs[bsk] || {}
            langs[bsk][key] = lobj
        }else{
            langs[key] = lobj
        }
    }
    return flist.folders
}


///////////////////// mysql 数据库 /////////////////////
global.MysqlDB_Pool = null
global.MysqlPool = function() {
    if(global.MysqlDB_Pool == null) {
        config.mysqldb.multipleStatements = true
        global.MysqlDB_Pool = mysql.createPool(config.mysqldb)
        global.MysqlDB_Pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
            if (error) throw error; // 数据库连接不成功则报错
            // console.log('The solution is: ', results[0].solution);
        });
    }
    return global.MysqlDB_Pool
}



////////////////////// loader //////////////////////

// require
global.appload = function(path) {
    if(path=="config"){
        return require("../config.js")
    }
    // others
    if( !path.startsWith('../') && !path.startsWith('./') ){
        path = './' + path
    }
    if( ! path.endsWith('.js') ){
        path += '.js'
    }
    return require(path)
}

// 文件操作
global.appabs = function(ph) {
    // others
    if( !ph.startsWith('../') && !ph.startsWith('./') ){
        ph = './app/' + ph
    }
    return path.resolve(ph)
}



// 默认加载的 model
appload('model/initmysql')
appload('model/transferlog')
