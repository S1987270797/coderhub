const Router = require('koa-router');
const { verifyAuth } = require('../middleWare/auth.middleWare');
const {
    create,
    list
} = require('../controller/label.controller.js')

const labelRouter = new Router({prefix: '/label'});

labelRouter.post('/create', verifyAuth, create);

labelRouter.get('/', list); // 获取标签列表

module.exports = labelRouter;