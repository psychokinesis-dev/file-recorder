const Koa = require('koa');
const koaBody = require('koa-body');
const Sequelize = require('sequelize');
const myRouters = require('./router');

const app = new Koa();

app.context.db = {};

app.context.db.instance = new Sequelize('database', 'username', 'password', {
    dialect: 'sqlite',
    storage: 'files.db',
    operatorsAliases: false,
    // disable logging; default: console.log
    logging: false
})

app.context.db.File = app.context.db.instance.define('file', {
    meta: Sequelize.JSON
})

app.context.db.Partition = app.context.db.instance.define('partition', {
    hash: Sequelize.STRING,
    meta: Sequelize.JSON,
    sequence: Sequelize.INTEGER
}, {
    indexes: [{
        fields: ['hash']
    }]
})

// associate
app.context.db.File.Partitions = app.context.db.File.hasMany(app.context.db.Partition)

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = err.message;
        ctx.app.emit('error', err, ctx);
    }
})

app.use(koaBody())
app.use(myRouters.routes())

app.context.db.instance.sync().then(() => {
    app.listen(3000)
})