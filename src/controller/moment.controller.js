const service = require("../service/moment.service.js");
const fs = require('fs');
const {
    APP_HOST,
    APP_PORT,
} = require('../app/config')

const {
    PICTURE_PATH
} = require('../constants/file-path');

const {
    removeFile
} = require('../utils/removeFile');

class MomentController {
    async create(ctx, next) {
        // 1.获取数据(user_id, content)
        const userId = ctx.user.id; // 在auth.middleware里做了 ctx.user = user;
        const content = ctx.request.body.content;
        console.log(userId, content);

        // 2.将数据插入到数据库中
        const result = await service.create(userId, content);

        ctx.response.body = result;
    }

    async detail(ctx, next) {
        // 1.拿到用户需要查询的momentId
        const momentId = ctx.request.params.momentId;

        const [result] = await service.getMomentDetailById(momentId, APP_HOST, APP_PORT);

        ctx.response.body = result;

    }

    async detailList(ctx, next) {
        // 1.拿到offset与size
        const { offset, size } = ctx.request.query;

        const [result] = await service.getMomentDetailList(offset, size);

        ctx.response.body = result;
    }

    async update(ctx, next) {
        // 1.拿到需要操作的数据
        const { momentId } = ctx.request.params;
        const { content } = ctx.request.body;
        console.log(momentId, content, ctx.user.id);

        // 每个操作数据库的地方最好放一个捕获, 不然会被上面的捕获

        /* try {
            const result = await service.updateMoment(momentId, content);
            ctx.response.body = result;
        } catch (error) {
            return console.log(error.message);
        } */

        // 但是经过前面的修改我们没有把指向这个函数的next放在try里面,这里的错误不会被前面的cathc捕获到. 这里只会报原生的错误.
        const result = await service.updateMoment(momentId, content);
        ctx.response.body = result;
    }

    async remove(ctx, next) {
        const { momentId } = ctx.request.params;

        // 删除动态 还要外带删除储存在本地的图片
        const momentPictureFiles = await service.getMomentPictureByMomentId(momentId);
        for (let file of momentPictureFiles) {
            removeFile(`${PICTURE_PATH}/${file.filename}`);
        }

        // 删除数据库的那条moment
        await service.removeMoment(momentId); // 先删除了这条动态,自然查不到这条动态的配图数据

        ctx.response.body = '删除动态成功~';
    }

    async addLabel(ctx, next) {
        // 1.得到数据: 1那条动态要插入标签(momentId) 2插入哪些标签
        const labels = ctx.newLabels;
        const { momentId } = ctx.request.params;

        // 2.判断这条动态是否已经有了这个标签, 如果有就不要再插入到 moment_labels数据表中
        for (let label of labels) {
            const result = await service.hasLabel(momentId, label.labelId);
            if (!result[0]) { // 没有数据的情况
                await service.attachLabel(momentId, label.labelId); // 粘贴标签
            }
        }
        ctx.response.body = '添加标签成功~';
    }

    async getLabels(ctx, next) {
        const { momentId } = ctx.request.params;
        const result = await service.getMomentLabels(momentId);
        ctx.response.body = result;
    }

    // 查看动态图片
    async momentImage(ctx, next) {
        const { filename } = ctx.request.params;
        const { type } = ctx.request.query;

        // 获取到图片的信息, 用于请求带有图片名字的链接直接展示大图.
        const fileINfo = await service.getMomentPictureByFilename(filename);
        ctx.response.set('content-type', fileINfo.mimetype);

        // 判断是否携带type query
        if (!type) { // 没有携带query的情况
            ctx.response.body = fs.createReadStream(`${PICTURE_PATH}/${fileINfo.filename}`);
        } else {
            ctx.response.body = fs.createReadStream(`${PICTURE_PATH}/${fileINfo.filename}-${type}`);
        }

        // coderwhy
        /* const types = ["small", "middle", "large"];
        if (types.some(item => item === type)) {
            filename = filename + '-' + type;
        } */

    }
}

module.exports = new MomentController();