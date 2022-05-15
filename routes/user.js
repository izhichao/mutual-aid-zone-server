const router = require('koa-router')();

router.prefix('/api/user');

router.post('/', function (ctx, next) {
  console.log(ctx.request.body);
  ctx.body = ctx.request.body;
  // ctx.body = ctx.query;
});

module.exports = router;
