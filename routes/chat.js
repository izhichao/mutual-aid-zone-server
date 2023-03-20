const router = require('koa-router')();
const ChatController = require('../controller/ChatController');
const { SuccessModel, ErrorModel } = require('../utils/resModel');
router.prefix('/api/chat');

router.get('/', async (ctx, next) => {
  const data = await ChatController.getChats();
  ctx.body = new SuccessModel(data);
});

router.post('/delete', async (ctx, next) => {
  const body = ctx.request.body;
  const data = await ChatController.deleteChat(body);
  ctx.body = new SuccessModel(data);
});

module.exports = router;
 