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

router.get('/detail', async (ctx, next) => {
  const body = ctx.request.body;
  const query = ctx.query;
  const data = await TaskController.getTaskDetail(body, query);
  ctx.body = new SuccessModel(data);
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

router.post('/delete', async (ctx, next) => {
  const body = ctx.request.body;
  const data = await TaskController.deleteTask(body);
  ctx.body = new SuccessModel(data);
});

router.post('/edit', async (ctx, next) => {
  ctx.body = 'edit';
});

router.post('/accept', async (ctx, next) => {
  const body = ctx.request.body;
  const data = await TaskController.acceptTask(body);
  ctx.body = new SuccessModel(data);
});

router.post('/giveup', async (ctx, next) => {
  const body = ctx.request.body;
  const data = await TaskController.giveupTask(body);
  ctx.body = new SuccessModel(data);
});

router.post('/finish', async (ctx, next) => {
  const body = ctx.request.body;
  const data = await TaskController.finishTask(body);
  ctx.body = new SuccessModel(data);
});

module.exports = router;
