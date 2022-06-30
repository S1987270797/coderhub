const Router = require('koa-router');

const {
    verifyAuth,
    verifyPermission
} = require('../middleWare/auth.middleWare');
const {
    create,
    reply,
    update,
    remove,
    list
} = require('../controller/comment.controller.js')

const commentRouter = new Router({ prefix: '/comment' });

commentRouter.post('/', verifyAuth, create); // 评论别人的moment
commentRouter.post('/:commentId/reply', verifyAuth, reply); // 回复评论

commentRouter.patch('/:commentId/update', verifyAuth, verifyPermission, update); // 修改评论
commentRouter.delete('/:commentId/delete', verifyAuth, verifyPermission, remove); // 删除评论

commentRouter.get('/', list); // 查询momentId下面所有的comment

module.exports = commentRouter;

