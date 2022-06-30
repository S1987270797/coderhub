const Router = require('koa-router');

const {
    verifyAuth
} = require('../middleWare/auth.middleWare');

const {
    saveAvatarInfo,
    savePictureInfo
} = require('../controller/file.controller')

const {
    avatarHandler,
    pictureHandler,
    pictureResize
} = require('../middleWare/file.middleWare');

const fileRouter = new Router({ prefix: "/upload" });

// 上传头像. 1.每个用户只能有一个头像(在数据库里只能有一条数据)
// 中间件1.验证是否登录 2.上传图片中间件 3.储存图片信息等操作
// saveAvatarInfo 里面包括更新头像操作
fileRouter.post('/avatar', verifyAuth, avatarHandler, saveAvatarInfo);

// 上传动态配图
// 上传之后将图片处理为三张不同大小的图片,分别应用不同的场景
fileRouter.post('/picture/:momentId', verifyAuth, pictureHandler, pictureResize, savePictureInfo);

module.exports = fileRouter;