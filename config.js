const config = {
    http_port: 8000,
    watch_restart_timeout: 7,
    lang: 'en', // 默认语言

    // 使用的 mysql 数据库
    mysqldb: {
        connectionLimit : 10,
        host     : '127.0.0.1',
        user     : 'root',
        password : '',
        database : 'hacash_trsdb',
    },

    ///////////////////////////////

    miner_api_url: "http://127.0.0.1:3338",
    ranking_api_url: "http://127.0.0.1:3377",

}




//////////////////////////////////




try{
    let dev = require('./config.use.js')
    for(let i in dev){
        config[i] = dev[i]
    }
}catch(e){}


module.exports = config
