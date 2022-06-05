const router = require('koa-router')();
const { SuccessModel, ErrorModel } = require('../model/resModel');
const StoreController = require('../controller/StoreController');

router.prefix('/api/store');

router.get('/', async (ctx, next) => {
  const body = ctx.request.body;
  const data = await StoreController.getGoods(body);
  ctx.body = new SuccessModel(data);
});

router.get('/detail', async (ctx, next) => {
  const body = ctx.request.body;
  const query = ctx.query;
  const data = await StoreController.getGood(body, query);
  ctx.body = new SuccessModel(data);
});

router.post('/create', async (ctx, next) => {
  const body = ctx.request.body;
  body.img = ctx.request.files.img?.path.split('\\').pop();
  const data = await StoreController.createGood(body);
  ctx.body = new SuccessModel(data);
});

router.post('/edit', async (ctx, next) => {
  const body = ctx.request.body;
  body.img = ctx.request.files.img?.path.split('\\').pop();
  const data = await StoreController.editGood(body);
  ctx.body = new SuccessModel(data);
});

router.post('/delete', async (ctx, next) => {
  const body = ctx.request.body;
  const data = await StoreController.deleteGood(body);
  ctx.body = new SuccessModel(data);
});

router.post('/exchange', async (ctx, next) => {
  const body = ctx.request.body;
  const data = await StoreController.exchangeGood(body);
  ctx.body = new SuccessModel(data);
});

router.get('/balance', async (ctx, next) => {
  const body = ctx.request.body;
  const data = await StoreController.getBalance(body);
  ctx.body = new SuccessModel(data);
});

router.post('/recharge', async (ctx, next) => {
  const body = ctx.request.body;
  const data = await StoreController.recharge(body);
  ctx.body = new SuccessModel(data);
});

module.exports = router;
