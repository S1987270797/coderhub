const service = require('../service/comment.service');
const errorTypes = require('../constants/error-type');

class CommentController {
    async create(ctx, next) {
        // 1.准备要操作的数据. 1谁评论的 2评论了那条动态 3说了什么
        const userId = ctx.user.id;
        const { momentId, content } = ctx.request.body;
        console.log(userId, momentId, content);

        // 这里也要写await, 不写的话返回的是一个 Promise { <pending> }
        // 不写的话不会等这个请求完成再赋值, 而是直接赋值再等待此时result已经不会再改变. 
        // 虽然结果因为create安函数才是这个真正发送请求的地方他写了await不会有问题, 就会没有打印信息.
        const result = await service.create(momentId, userId, content);
        ctx.response.body = result;
    }

    // 回复别人的评论
    async reply(ctx, next) {
        // 1.准备数据. 1在谁的动态下面 2在那条评论下面 3谁发的 4发了什么
        const { momentId, content } = ctx.request.body;
        const { commentId } = ctx.request.params;
        const userId = ctx.user.id;

        try {
            const result = await service.reply(momentId, userId, content, commentId);
            ctx.response.body = result;
        } catch (err) {
            const error = new Error(errorTypes.REPLY_FAILED);
            return ctx.app.emit('errorR', error, ctx);
        }
    }

    async update(ctx, next) {
        // 1.准备数据. 需要修改的comment, 需要修改的内容
        const { commentId } = ctx.request.params;
        const { content } = ctx.request.body;
        console.log(commentId);
        console.log(content);

        const result = await service.update(commentId, content);
        ctx.response.body = result;
    }

    async remove(ctx, next) {
        const { commentId } = ctx.request.params;
        const result = await service.delete(commentId);
        ctx.response.body = result;
    }

    async list(ctx, next) {
        const { momentId } = ctx.request.query;
        const result = await service.getCommentListByMomentId(momentId);
        ctx.response.body = result;
    }
}

module.exports = new CommentController();