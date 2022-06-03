const router = require('koa-router')();
const { SuccessModel, ErrorModel } = require('../model/resModel');
const UserController = require('../controller/UserController');

router.prefix('/api/user');

router.post('/login', async (ctx, next) => {
  const body = ctx.request.body;
  const data = await UserController.login(body);
  if (data === '用户名或密码错误') {
    ctx.body = new ErrorModel(data);
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

router.get('/list', async (ctx, next) => {
  const data = await UserController.getUsers();
  ctx.body = new SuccessModel(data);
});

router.get('/detail', async (ctx, next) => {
  const body = ctx.request.body;
  const query = ctx.query;
  const data = await UserController.getUser(body, query);
  ctx.body = new SuccessModel(data);
});

router.post('/password', async (ctx, next) => {
  const body = ctx.request.body;
  const data = await UserController.changePassword(body);
  if (data === '修改成功') {
    ctx.body = new SuccessModel(data);
  } else {
    ctx.body = new ErrorModel(data);
  }
});

router.post('/edit', async (ctx, next) => {
  const body = ctx.request.body;
  // 获取上传图片名称
  body.avatar = ctx.request.files.avatar?.path.split('\\').pop();
  const data = await UserController.editUser(body);
  ctx.body = new SuccessModel(data);
});

router.post('/delete', async (ctx, next) => {
  const body = ctx.request.body;
  const data = await UserController.deleteUser(body);
  ctx.body = new SuccessModel(data);
});

module.exports = router;
