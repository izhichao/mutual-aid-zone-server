const router = require('koa-router')();

router.prefix('/api/store');

router.get('/', function (ctx, next) {
  ctx.body = 'this is a store page';
});

module.exports = router;
