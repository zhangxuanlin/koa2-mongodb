const Router = require('koa-router');
const router = new Router();

router.get('/', async ctx => {
    ctx.body = 'book'
}).get('/book1', async ctx => {
    ctx.body = 'book1'
}).get('/book2', async ctx => {
    ctx.body = 'book2'
});

module.exports = router.routes();
