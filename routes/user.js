const router = require('koa-router')();

router.prefix('/api/user');

router.post('/login', (ctx, next) => {
  ctx.body = 'login';
});

router.post('/register', (ctx, next) => {
  ctx.body = 'register';
});

router.get('/detail', (ctx, next) => {
  ctx.body = 'detail';
});

router.post('/password', (ctx, next) => {
  ctx.body = 'password';
});

router.post('/edit', (ctx, next) => {

});

module.exports = router;
