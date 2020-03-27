const Router = require('koa-router');
const router = new Router();

router.get('/', async ctx => {
    ctx.body = 'admin'
}).get('/admin1', async ctx => {
    ctx.body = 'admin1'
}).get('/admin2', async ctx => {
    ctx.body = 'admin2'
});


module.exports = router.routes();
