const service = require('../service/label.service.js')

class LabelController {
    async create(ctx, next) {
        const { name } = ctx.request.body;
        console.log(name);
        const result = await service.create(name);
        ctx.response.body = result;
    }

    async list(ctx, next) {
        const { limit, offset } = ctx.request.query;
        const result = await service.getList(limit, offset);
        ctx.response.body = result;
    }
}

module.exports = new LabelController();