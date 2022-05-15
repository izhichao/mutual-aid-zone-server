const router = require('koa-router')();

router.prefix('/api/task');

router.get('/', (ctx, next) => {
  ctx.body = 'tasklist';
});

router.get('/publish', (ctx, next) => {
  ctx.body = 'publish';
});

router.get('/accept', (ctx, next) => {
  ctx.body = 'accept';
});

router.get('/detail', (ctx, next) => {
  ctx.body = 'detail';
});

router.post('/create', (ctx, next) => {
  ctx.body = 'create';
});

router.post('/delete', (ctx, next) => {
  ctx.body = 'delete';
});

router.post('/edit', (ctx, next) => {
  ctx.body = 'edit';
});

router.post('/accept', (ctx, next) => {
  ctx.body = 'accept';
});

router.post('/giveup', (ctx, next) => {
  ctx.body = 'giveup';
});

router.post('/finish', (ctx, next) => {
  ctx.body = 'finish';
});

module.exports = router;
