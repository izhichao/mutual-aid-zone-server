const path = require('path');
const Koa = require('koa');
const app = new Koa();
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const formidable = require('koa2-formidable');
const logger = require('koa-logger');
const user = require('./routes/user');
const task = require('./routes/task');
const store = require('./routes/store');
const cors = require('koa2-cors');
const koajwt = require('koa-jwt');
const jwt = require('jsonwebtoken');
const SECURT_KEY = 'IHS9794Nis';

// error handler
onerror(app);

// middlewares
app.use(formidable({ multiples: true, uploadDir: path.join(__dirname, 'public', 'images'), keepExtensions: true }));
app.use(bodyparser());
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));
app.use(
  cors({
    origin(ctx) {
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

// 处理无token或token过期
app.use((ctx, next) => {
  return next().catch((err) => {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = 'Protected resource, use Authorization header to get access\n';
    } else {
      throw err;
    }
  });
});

// 使用koajwt进行token验证
app.use(
  koajwt({
    secret: SECURT_KEY,
    passthrough: true
  }).unless({
    path: [/\/api\/task/, /\/api\/user\/register/, /\/api\/user\/login/]
  })
);

// 获取_id
app.use((ctx, next) => {
  let token = ctx.header.authorization;
  if (token) {
    let payload = jwt.decode(token.split(' ')[1], 'IHS9794Nis');
    ctx.request.body._id = payload._id;
  }
  return next();
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
