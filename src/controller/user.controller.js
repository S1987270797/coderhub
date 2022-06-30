const fs = require('fs');

const userService = require('../service/user.service');
const fileService = require('../service/file.service');

const {
    AVATAR_PATH
} = require('../constants/file-path');

class UserController {
    async create(ctx, next) {
        // 获取用户请求传递的参数
        const user = ctx.request.body;

        // 操作数据(数据库)创建用户
        const result = await userService.create(user);

        // 返回数据
        ctx.body = result;
    }

    async avatarInfo(ctx, next) {
        const { userId } = ctx.request.params;
        // 获取头像信息
        const avatarInfo = await fileService.getAvatarByUserId(userId);

        ctx.response.set('content-type', avatarInfo.mimetype); // 告诉浏览器我们响应的类型, content-type类型是什么就显示什么
        ctx.response.body = fs.createReadStream(`${AVATAR_PATH}/${avatarInfo.filename}`); // 默认是下载文件
    }
}

module.exports = new UserController();