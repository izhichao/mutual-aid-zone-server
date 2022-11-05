const router = require('koa-router')();
const TaskController = require('../controller/TaskController');
const { SuccessModel, ErrorModel } = require('../model/resModel');
router.prefix('/api/task');

router.get('/', async (ctx, next) => {
  const query = ctx.query;
  const data = await TaskController.getTasks(query);
  ctx.body = new SuccessModel(data);
});

router.get('/publish', async (ctx, next) => {
  const body = ctx.request.body;
  const query = ctx.query;
  const data = await TaskController.getPublishTasks(body, query);
  ctx.body = new SuccessModel(data);
});

router.get('/accept', async (ctx, next) => {
  const body = ctx.request.body;
  const query = ctx.query;
  const data = await TaskController.getAcceptTasks(body, query);
  ctx.body = new SuccessModel(data);
});

router.get('/search', async (ctx, next) => {
  const query = ctx.query;
  const data = await TaskController.getSearchTasks(query);
  ctx.body = new SuccessModel(data);
});

router.get('/detail', async (ctx, next) => {
  const body = ctx.request.body;
  const query = ctx.query;
  const data = await TaskController.getTaskDetail(body, query);
  if (typeof data === 'string') {
    ctx.body = new ErrorModel(data);
  } else {
    ctx.body = new SuccessModel(data);
  }
});

router.post('/create', async (ctx, next) => {
  const body = ctx.request.body;
  // 获取上传到图片url
  body.imgs = [];
  let imgFiles = ctx.request.files.imgFiles;
  // 多张图片
  if (imgFiles instanceof Array) {
    imgFiles.forEach((item) => {
      if (item.path.includes('\\')) {
        body.imgs.push(item.path.split('\\').pop());
      } else {
        body.imgs.push(item.path.split('/').pop());
      }
    });
  } else if (imgFiles instanceof Object) {
    // 单张图片
    if (imgFiles.path.includes('\\')) {
      body.imgs.push(imgFiles.path.split('\\').pop());
    } else {
      body.imgs.push(imgFiles.path.split('/').pop());
    }
  }
  const data = await TaskController.createTask(body);
  if (typeof data === 'string') {
    ctx.body = new ErrorModel(data);
  } else {
    ctx.body = new SuccessModel(data);
  }
});

router.post('/delete', async (ctx, next) => {
  const body = ctx.request.body;
  const data = await TaskController.deleteTask(body);
  ctx.body = new SuccessModel(data);
});

router.post('/edit', async (ctx, next) => {
  const body = ctx.request.body;
  // 获取上传到图片url
  body.imgs = [];
  let imgFiles = ctx.request.files.imgFiles;
  if (imgFiles instanceof Array) {
    imgFiles.forEach((item) => {
      if (item.path.includes('\\')) {
        body.imgs.push(item.path.split('\\').pop());
      } else {
        body.imgs.push(item.path.split('/').pop());
      }
    });
  } else if (imgFiles instanceof Object) {
    if (imgFiles.path.includes('\\')) {
      body.imgs.push(imgFiles.path.split('\\').pop());
    } else {
      body.imgs.push(imgFiles.path.split('/').pop());
    }
  }
  const data = await TaskController.editTask(body);
  if (typeof data === 'string') {
    ctx.body = new ErrorModel(data);
  } else {
    ctx.body = new SuccessModel(data);
  }
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
