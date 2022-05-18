const router = require('koa-router')();
const { SuccessModel, ErrorModel } = require('../model/resModel');
const StoreController = require('../controller/StoreController');

router.prefix('/api/store');

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
