/**
 *
 */

const fs = require('fs')
const path = require('path')

const mysql = require('mysql');

const cookieParser = require('cookie-parser');

const routes = require('./routes.js');
const viewer = require('./viewer.js');
const config = require('../config.js');

const toolfs = require('./tool/fs.js')

const langDefs = ['en_US', 'zh_CN']

module.exports = function(app)
{
    var scklg = function(res, ty){
        res.cookie("lang", ty, {path:"/", maxAge:1000*60*60*24,})
    }

    app.use(cookieParser()); 

    // lang
    app.use(function(req, res, next){
        let ty = config.lang || langDefs[0]
          , q = req.query 
          , cks = req.cookies
        if(q.lang) {
            ty = q.lang
        }else if(cks.lang){
            ty = cks.lang
        }
        if(langDefs.indexOf(ty)==-1) {
            ty = langDefs[0]
        }
        scklg(res, ty)
        res.lang = loadLanguage(ty)
        res.lang.useset = ty
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
const languageDefType = "en_US"
const languageSupport = {'en_US':true,'zh_CN':true}
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
