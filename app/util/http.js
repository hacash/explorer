const http = require("http")
const https = require("https")
const querystring = require("querystring")


exports.json = function(url, querys, opts) {
    let qsstr = ""
    if( querys ) {
        qsstr = "?" + querystring.stringify(querys)
    }
    opts = opts || {}
    let request_url = url + qsstr
    let http_obj = request_url.startsWith("https:") ? https : http
    let timeout = opts.timeout || 8000
    let max_bytes = opts.max_bytes || 4 * 1024 * 1024
    return new Promise( (ok, err) => {
        let done = false
        let finish = function(fn, data) {
            if(done) return
            done = true
            fn(data)
        }
        let req = http_obj.get(request_url, {timeout}, (res) => {
            var str = ''
            let size = 0
            res.on('data', (part) => {
                size += part.length
                if(size > max_bytes) {
                    req.destroy(new Error("upstream response too large"))
                    return
                }
                str += part.toString()
            })
            res.on('end', () =>  {
                if(res.statusCode < 200 || res.statusCode >= 300) {
                    finish(err, new Error("upstream status " + res.statusCode))
                    return
                }
                try{
                    var data = JSON.parse(str)
                    finish(ok, data)
                }catch(e){
                    finish(err, new Error("upstream response is not json"))
                }
            })
        })
        req.on('timeout', () => req.destroy(new Error("upstream request timeout")))
        req.on('error', (e) => finish(err, e))
    })
}
