const fs = require('fs');
const {
    AVATAR_PATH
} = require('../constants/file-path')

const {
    APP_HOST,
    APP_PORT,
} = require('../app/config')

const fileService = require('../service/file.service');
const UserService = require('../service/user.service');


class fileController {
    // 保存头像信息
    async saveAvatarInfo(ctx, next) {
        // 1.获取需要储存的数据
        const { mimetype, filename, size, } = ctx.req.file; // 必须要用req
        const { id } = ctx.user;

        // 2.判断用户是否已经上传了头像
        // 2.1.从数据库查询该用户已经有的头像信息
        const avatarInfo = await fileService.getAvatarByUserId(id);
        console.log(avatarInfo);
        // 2.2 判断这个用户有没有上传头像
        // 没有的情况
        if (!avatarInfo) {
            // 创建新的图片 
            console.log('创建新的图片');
            await fileService.createAvatar(filename, mimetype, size, id);
        } else { // 删除原来的图片, 更新原来数据库的数据
            console.log('update avatar');
            // 查到原来图片的filename是什么
            const beforeFilename = avatarInfo.filename;
            // 删除储存好的图片
            fs.unlink(`${AVATAR_PATH}/${beforeFilename}`,(err) => {
                if (err) throw err;
                console.log(`${AVATAR_PATH}/${beforeFilename} was deleted~`);
            });
            // 上传新的图片
            /* 这个在前面的中间件已经做了, 之前是无论如何都会新增图片,不会删除原来的图片 */

            // 更新数据
            await fileService.updateAvatarInfo(filename, mimetype, size, id);
        }

        // 3.将avatar地址储存在user表中, 注意这个是操作user表
        const avatarUrl = `${APP_HOST}:${APP_PORT}/user/${id}/avatar`;
        await UserService.updateAvatarUrlByUserId(avatarUrl, id);

        ctx.response.body = '上传头像成功~';

    }

    // 保存动态图片信息
    async savePictureInfo(ctx, next) {
        // 1.获取需要储存的数据; 1哪条动态 2哪个用户 3 filename,mimetype,size
        const { momentId } = ctx.request.params;
        const { id } = ctx.user;

        for (let file of ctx.req.files) {
            const { filename, mimetype, size } = file;
            await fileService.createMomentPicture(id, momentId, filename, mimetype, size);
        }

        ctx.response.body = '动态配图上传成功~';
    }
}

module.exports = new fileController();