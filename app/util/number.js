
exports.toThousands = function (num) {
    return (num+'').replace(/\d+/, function(n) {
       return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    });
}



 