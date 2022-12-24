const router = require('koa-router')();
const OrderController = require('../controller/OrderController');
const { SuccessModel, ErrorModel } = require('../utils/resModel');
router.prefix('/api/order');

router.get('/', async (ctx, next) => {
  const { userId } = ctx.request.body;
  const data = await OrderController.getOrders(userId);
  ctx.body = new SuccessModel(data);
});

module.exports = router;
