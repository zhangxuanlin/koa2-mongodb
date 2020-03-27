const Koa = require('koa');
const session = require('koa-session');
const render = require('koa-art-template');
const Router = require('koa-router');
const path = require('path');

const app = new Koa();
const router = new Router();
render(app, {
  root: path.join(__dirname, 'views'),
  extname: '.html',
  debug: process.env.NODE_ENV !== 'production'
});
app.keys = ['some secret hurr'];
 
const CONFIG = {
  key: 'koa:sess',
  maxAge: 86400000,
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: true, // 默认false，快过期时，重新请求接口会重新设置过期时间
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};
app.use(session(CONFIG, app));
// app.use(async function (ctx) {
//   await ctx.render('user');
// });
router.get('/', async ctx => {
    let obj = {
        name: '张玄林',
        a: 5,
        b: 6,
        p: '<p>原文输出</p>',
        c: 106,
        d: [{ name: 'zxl', age: 45 }, { name: 'cl', age: 44 }]
    }
    // cookies 设置
    ctx.cookies.set('userInfo', encodeURIComponent(JSON.stringify(obj)), {
      maxAge: 20000, // 一个数字表示从 Date.now() 得到的毫秒数
      expires: '2020-03-30', // 过期时间
      path: '/shop', // 指定路径，只有在shop路由下才得到userInfo信息
      httpOnly: false, // 默认true，true只能在服务端使用，false服务端和客户端都可以使用
    });
    // session 设置
    ctx.session.name = obj.name;
    await ctx.render('index', {
        name: obj.name,
        a: obj.a,
        b: obj.b,
        p: obj.p,
        c: obj.c,
        d: obj.d
    });
}).get('/news', async ctx => {
  const userInfo = ctx.cookies.get('userInfo');
  console.log(decodeURIComponent(userInfo), 'news')
  const name = ctx.session.name;
  console.log('session', name)
  ctx.body = 'news';
}).get('/shop', async ctx => {
  const userInfo = ctx.cookies.get('userInfo');
  console.log(decodeURIComponent(userInfo), 'shop')
  await ctx.render('shop');
})

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(8080);