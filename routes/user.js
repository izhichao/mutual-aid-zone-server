const router = require('koa-router')();

router.prefix('/api/user');

router.get('/', function (ctx, next) {
  ctx.body = 'this is a user response!';
});

module.exports = router;
