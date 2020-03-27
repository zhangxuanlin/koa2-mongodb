// https://www.javmec.com/movie/300maan-459-how-nice-the-storm-will-not-stop-charismatic-explosion-eloin-that-licks-a-nice-look-with-overwhelming.html
var Koa = require('koa');
var Router = require('koa-router');

var app = new Koa();
var router = new Router();

/**
 * 应用级中间件
 */
app.use(async (ctx, next) => {
    console.log('1. 应用级中间件')
    // if (n > 5) {
    //     router.redirect('/login');
    //     next();
    // } else {
    //     await next();
    // }
    await next();
    console.log('7. 应用级中间件1111');
})
/**
 * 错误中间件
 */
app.use(async (ctx, next) => {
    console.log('2. 错误中间件')
    console.log(ctx.status)
    next();
    if (ctx.status == 404) {
        ctx.status = 404
        ctx.body = '错误中间件';
        console.log('6. 错误中间件1111');
    } else {
        console.log(ctx.url)
    }
})
/**
 * 路由级中间件
 */
router.use('/news', async (ctx, next) => {
    console.log('3. 路由级中间件');
    await next();
    console.log('5. 路由级中间件1111');
})
router.get('/', async (ctx) => {
    ctx.body = 'router';
}).get('/news', async ctx => {
    console.log('4. news');
    // console.log(ctx.query)  // 取url参数，返回对象格式
    // console.log(ctx.querystring)    // 取url参数，返回字符串格式
    // console.log(ctx.request.query)  // 从request里取参数，同ctx.query
    ctx.body = 'news'
})
router.get('/login', async ctx => {
    ctx.body = 'login'
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000)