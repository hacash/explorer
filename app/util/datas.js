
exports.list_to_table = function(list, keys) {

    let table = {rows: [], cols: keys}
    for(let i in list){
        let li = list[i]
        let one = []
        for(let j in keys) {
            let k = keys[j]
            one.push(li[k])
        }
        table.rows.push(one);
    }
    return table
}