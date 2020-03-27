const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const { mongoUrl, dbName } = require('./config');

class DB {
    static getInstance() { // 单例，多次实例化之后出发一次
        if (!DB.instance) {
            DB.instance = new DB();
        }
        return DB.instance;
    }
    constructor() {
        this.Client = '';
        this.connect();
    }
    /**
     * 链接数据库
     */
    connect() {
        const that = this;
        return new Promise((resolve, reject) => {
            if (!that.Client) { // 解决数据库多次链接的问题
                MongoClient.connect(mongoUrl, (err, client) => {
                    if (err) {
                        reject(err);
                    } else {
                        const db = client.db(dbName);
                        resolve(db);
                        that.Client = db;
                    }
                });
            } else {
                resolve(that.Client);
            }
        })
        
    }
    /**
     * 添加
     */
    insert(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).insertOne(json, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result)
                    }
                })
            })
        })
    }
    /**
     * 删除
     */
    remove(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).removeOne(json, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                })
            })
        })
    }
    /**
     * 修改
     */
    update(collectionName, json1, json2) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).updateOne(json1, {
                    $set: json2
                }, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                })
            })
        })
    }
    /**
     * 查找
     */
    find(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                const result = db.collection(collectionName).find(json);
                result.toArray((err, doc) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(doc)
                    }
                })
            })
        })
    }
    /**
     * 更改id
     */
    ObjectID(id) {
        return ObjectID(id);
    }
}

module.exports = DB.getInstance();
// const a = DB.getInstance();
// setTimeout(() => {
//     console.time('start1');
//     a.find('user', {}).then(data => {
//         console.timeEnd('start1');
//         // console.log(data)
//     })
// }, 100);
// setTimeout(() => {
//     console.time('start2');
//     a.find('user', {}).then(data => {
//         console.timeEnd('start2');
//         // console.log(data)
//     })
// }, 2000);

// const b = DB.getInstance();
// setTimeout(() => {
//     console.time('start3');
//     b.find('user', {}).then(data => {
//         console.timeEnd('start3');
//         // console.log(data)
//     })
// }, 5000);
// setTimeout(() => {
//     console.time('start4');
//     b.find('user', {}).then(data => {
//         console.timeEnd('start4');
//         // console.log(data)
//     })
// }, 6000);


