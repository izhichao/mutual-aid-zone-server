const router = require('koa-router')();
const { SuccessModel, ErrorModel } = require('../utils/resModel');
const UserController = require('../controller/UserController');

router.prefix('/user');

router.get('/', async (ctx, next) => {
  const data = await UserController.getUsers();
  ctx.body = new SuccessModel(data);
});

router.post('/login', async (ctx, next) => {
  const body = ctx.request.body;
  const data = await UserController.login(body);
  if (data === '用户名或密码错误') {
    ctx.body = new ErrorModel(data);
  } else {
    ctx.body = new SuccessModel(data);
  }
});

router.post('/code', async (ctx, next) => {
  const body = ctx.request.body;
  const data = await UserController.getCode(body);
  if (data === '发送成功') {
    ctx.body = new SuccessModel(data);
  } else {
    ctx.body = new ErrorModel(data);
  }
});

router.post('/register', async (ctx, next) => {
  const body = ctx.request.body;
  const data = await UserController.register(body);
  if (data === '注册成功') {
    ctx.body = new SuccessModel(data);
  } else {
    ctx.body = new ErrorModel(data);
  }
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

router.post('/forget', async (ctx, next) => {
  const body = ctx.request.body;
  const data = await UserController.forgetPassword(body);
  if (data === '邮箱不存在，请先注册！') {
    ctx.body = new ErrorModel(data);
  } else {
    ctx.body = new SuccessModel(data);
  }
});
router.post('/edit', async (ctx, next) => {
  const body = ctx.request.body;
  // 获取上传图片名称
  if (ctx.request.files.avatar?.path.includes('\\')) {
    body.avatar = ctx.request.files.avatar?.path.split('\\').pop();
  } else {
    body.avatar = ctx.request.files.avatar?.path.split('/').pop();
  }
  const data = await UserController.editUser(body);
  if (data === '修改成功') {
    ctx.body = new SuccessModel(data);
  } else {
    ctx.body = new ErrorModel(data);
  }
});

router.post('/delete', async (ctx, next) => {
  const body = ctx.request.body;
  const data = await UserController.deleteUser(body);
  ctx.body = new SuccessModel(data);
});

module.exports = router;
