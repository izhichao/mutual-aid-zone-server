const router = require('koa-router')();
const TaskController = require('../controller/TaskController');
const { SuccessModel, ErrorModel } = require('../model/resModel');
router.prefix('/api/task');

router.get('/', async (ctx, next) => {
  const data = await TaskController.getTasks();
  ctx.body = new SuccessModel(data);
});

router.get('/publish', async (ctx, next) => {
  const body = ctx.request.body;
  const data = await TaskController.getPublishTasks(body);
  ctx.body = new SuccessModel(data);
});

router.get('/accept', async (ctx, next) => {
  const body = ctx.request.body;
  const data = await TaskController.getAcceptTasks(body);
  ctx.body = new SuccessModel(data);
});

router.get('/detail', (ctx, next) => {
  ctx.body = 'detail';
});

router.post('/create', async (ctx, next) => {
  const body = ctx.request.body;
  body.imgs = [];
  // 获取上传到图片url
  ctx.request.files.imgFiles &&
    ctx.request.files.imgFiles.forEach((item) => {
      body.imgs.push(item.path.split('\\').pop());
    });
  const data = await TaskController.createTask(body);
  ctx.body = new SuccessModel(data);
});

router.post('/delete', (ctx, next) => {
  ctx.body = 'delete';
});

router.post('/edit', (ctx, next) => {
  ctx.body = 'edit';
});

router.post('/accept', (ctx, next) => {
  ctx.body = 'accept';
});

router.post('/giveup', (ctx, next) => {
  ctx.body = 'giveup';
});

router.post('/finish', (ctx, next) => {
  ctx.body = 'finish';
});

module.exports = router;
