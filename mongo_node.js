const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const render = require('koa-art-template');
const assert = require('assert');
const path = require('path');
const db = require('./module/db');
const admin = require('./routers/admin/index.js');
const book = require('./routers/book/index.js');

const app = new Koa();
const router = new Router();

app.use(bodyParser());
render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production'
});

router.get('/', async ctx => {
    // console.time('start1');
    const result = await db.find('user', {});
    // console.log(result);
    // console.timeEnd('start1');
    // ctx.body = 'home';
    ctx.render('mongo', {
        users: result
    });
}).get('/news', async ctx => {
    console.time('start2');
    const result = await db.find('user', {});
    console.log(result);
    console.timeEnd('start2');
    ctx.body = 'news';
}).get('/add', async ctx => {
    // db.insert('user', {
    //     name: 'chenguo',
    //     age: 35
    // });
    // ctx.body = 'add';
    ctx.render('add');
}).get('/update', async ctx => {
    // const data = await db.update('user', {
    //     name: 'chenguo',
    // }, {
    //     name: 'chenguo111',
    // });
    // console.log(data.result);
    // ctx.body = 'update';
    const id = ctx.query.id;
    const data = await db.find('user', { _id: db.ObjectID(id)});
    ctx.render('update', {
        user: data[0]
    })
}).get('/remove', async ctx => {
    // const data = await db.remove('user', { name: 'chenguo111' });
    // console.log(data.result);
    // ctx.body = 'remove';
    const id = ctx.query.id;
    const data = await db.remove('user', { _id: db.ObjectID(id) });
    ctx.redirect('/');
}).post('/doAdd', async ctx => {
    const data = await db.insert('user', ctx.request.body);
    try {
        if (data.result.ok) {
            ctx.redirect('/');
        }
    } catch (error) {
        ctx.redirect('/add');
    }
}).post('/doUpdate', async ctx => {
    console.log(ctx.request.body)
    const { id, name, age } = ctx.request.body;
    console.log(id, name, age)
    const data = await db.update('user', {
        _id: db.ObjectID(id)
    }, {
        name,
        age
    });
    try {
        if (data.result.ok) {
            ctx.redirect('/');
        }
    } catch (error) {
        ctx.redirect('/update');
    }
});

/**
 * 封装接口
 */
router.get('/itying/user/:id', async ctx => {
    const id = ctx.params.id;
    const data = await db.find('user', { _id: db.ObjectID(id) });
    try {
        ctx.body = {
            code: 1,
            data: data[0],
        };
    } catch (error) {
        ctx.body = {
            code: 0,
            data: {}
        }
    }
})

router.use('/admin', admin)
    .use('/book', book);
app
    .use(router.routes())
    .use(router.allowedMethods());


app.listen(8000);