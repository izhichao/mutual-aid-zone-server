const router = require('koa-router')();
const ChatController = require('../controller/ChatController');
const { SuccessModel, ErrorModel } = require('../utils/resModel');
router.prefix('/api/chat');

router.get('/', async (ctx, next) => {
  const data = await ChatController.getChats();
  ctx.body = new SuccessModel(data);
});

module.exports = router;
 