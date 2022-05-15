const Koa = require('koa');
const app = new Koa();
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const formidable = require('koa2-formidable');
const user = require('./routes/user');
const task = require('./routes/task');
const store = require('./routes/store');
const cors = require('koa2-cors');

// error handler
onerror(app);

// middlewares
app.use(formidable());
app.use(bodyparser());
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));
app.use(
  cors({
    origin: function (ctx) {
      return '*';
    },
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization']
  })
);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(user.routes(), user.allowedMethods());
app.use(task.routes(), task.allowedMethods());
app.use(store.routes(), store.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

module.exports = app;
