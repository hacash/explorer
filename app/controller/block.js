/**
 * 
 */
const viewer = appload('viewer')
const config = appload('config')



module.exports = function(req, res)
{
    viewer.render('block', config, {}, req, res)
}
