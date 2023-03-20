const path = require('path');
const Koa = require('koa');
const app = new Koa();
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const formidable = require('koa2-formidable');
const koaLogger = require('koa-logger');
const user = require('./routes/user');
const task = require('./routes/task');
const store = require('./routes/store');
const order = require('./routes/order');
const ticket = require('./routes/ticket');
const chat = require('./routes/chat');
const cors = require('koa2-cors');
const koajwt = require('koa-jwt');
const jwt = require('jsonwebtoken');
const log4js = require('./utils/log4js');
const SECURT_KEY = process.env.SECURT_KEY;
const logger = log4js.getLogger();
// error handler
onerror(app);

// middlewares
app.use(formidable({ multiples: true, uploadDir: path.join(__dirname, 'public', 'images'), keepExtensions: true }));
app.use(bodyparser());
app.use(json());
app.use(koaLogger());
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
  logger.debug(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// 处理无token或token过期
app.use((ctx, next) => {
  return next().catch((err) => {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = '请先登录';
    } else {
      throw err;
    }
  });
});

// 使用koajwt进行token验证
app.use(
  koajwt({
    secret: SECURT_KEY
  }).unless({
    path: [
      /\/api\/task$/,
      /\/api\/task\/search/,
      /\/api\/user\/register/,
      /\/api\/user\/login/,
      /\/api\/user\/forget/,
      /\/api\/user\/code/
    ]
  })
);

// 获取userId,url
app.use((ctx, next) => {
  let token = ctx.header.authorization;
  if (token) {
    let payload = jwt.decode(token.split(' ')[1], SECURT_KEY);
    if (payload) {
      ctx.request.body.userId = payload.userId;
    }
  }
  if (process.env.NODE_ENV === 'production') {
    ctx.request.body.url = `${ctx.request.header.host}/zone`;
    ctx.request.body.protocol = `https`;
  } else {
    ctx.request.body.url = ctx.request.header.host;
    ctx.request.body.protocol = `http`;
  }
  return next();
});

// routes
app.use(user.routes(), user.allowedMethods());
app.use(task.routes(), task.allowedMethods());
app.use(store.routes(), store.allowedMethods());
app.use(order.routes(), order.allowedMethods());
app.use(ticket.routes(), ticket.allowedMethods());
app.use(chat.routes(), chat.allowedMethods());

// error-handling
app.on('error', (err) => {
  logger.error('server error', err);
});

module.exports = app;
