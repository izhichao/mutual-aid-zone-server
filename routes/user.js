const router = require('koa-router')();
const { SuccessModel, ErrorModel } = require('../model/resModel');
const UserController = require('../controller/UserController');

router.prefix('/api/user');

router.post('/login', async (ctx, next) => {
  const body = ctx.request.body;
  const data = await UserController.login(body);
  if (data === '用户名或密码错误') {
    ctx.body = new ErrorModel('用户名或密码错误');
  } else {
    ctx.body = new SuccessModel(data);
  }
});

router.post('/register', async (ctx, next) => {
  const body = ctx.request.body;
  const data = await UserController.register(body);
  if (data === '用户名已存在') {
    ctx.body = new ErrorModel(data);
  } else {
    ctx.body = new SuccessModel(data);
  }
});

router.get('/detail', (ctx, next) => {
  ctx.body = 'detail';
});

router.post('/password', (ctx, next) => {
  ctx.body = 'password';
});

router.post('/edit', (ctx, next) => {});

module.exports = router;
