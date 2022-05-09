const router = require('koa-router')();

router.prefix('/api/task');

router.get('/', function (ctx, next) {
  ctx.body = 'this is a task page';
});

module.exports = router;
