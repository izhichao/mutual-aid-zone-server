const router = require('koa-router')();
const OrderController = require('../controller/OrderController');
const { SuccessModel, ErrorModel } = require('../utils/resModel');
router.prefix('/order');

router.get('/', async (ctx, next) => {
  const query = ctx.query;
  const body = ctx.request.body;
  const data = await OrderController.getOrders(body, query);
  ctx.body = new SuccessModel(data);
});

router.get('/detail', async (ctx, next) => {
  const query = ctx.query;
  const data = await OrderController.getOrder(query);
  ctx.body = new SuccessModel(data);
});

router.post('/edit', async (ctx, next) => {
  const body = ctx.request.body;
  const data = await OrderController.editOrder(body);
  ctx.body = new SuccessModel(data);
});

router.post('/finish', async (ctx, next) => {
  const body = ctx.request.body;
  const data = await OrderController.finishOrder(body);
  ctx.body = new SuccessModel(data);
});

module.exports = router;
 