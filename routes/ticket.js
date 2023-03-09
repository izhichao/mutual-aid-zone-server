const router = require('koa-router')();
const { SuccessModel, ErrorModel } = require('../utils/resModel');
const TicketController = require('../controller/TicketController');

router.prefix('/api/ticket');

router.get('/', async (ctx, next) => {
  const body = ctx.request.body;
  const data = await TicketController.getTickets(body);
  ctx.body = new SuccessModel(data);
});

router.get('/all', async (ctx, next) => {
  const data = await TicketController.getAllTickets();
  ctx.body = new SuccessModel(data);
});

router.post('/question', async (ctx, next) => {
  const body = ctx.request.body;
  const data = await TicketController.createTicket(body);
  ctx.body = new SuccessModel(data);
});

router.post('/answer', async (ctx, next) => {
  const body = ctx.request.body;
  const data = await TicketController.answerTicket(body);
  ctx.body = new SuccessModel(data);
});

module.exports = router;
