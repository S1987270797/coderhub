const multer = require('koa-multer');
const Jimp = require('jimp');
const path = require('path');

const {
    AVATAR_PATH,
    PICTURE_PATH
} = require('../constants/file-path');

const avatarUpload = multer({ // multer是一个函数, 返回一个对象.
    dest: AVATAR_PATH,
})

const pictureUpload = multer({
    dest: PICTURE_PATH,
});

// 上传头像中间件
const avatarHandler = avatarUpload.single('avatar'); // 返回的是一个函数

// 上传动态配图
const pictureHandler = pictureUpload.array('picture', 9); // formdate: key:picture ,value: 图片

// 前面的pictureHandler中间件会上传一张原图, 到这里又会产生三张规定规格的图.
const pictureResize = async (ctx, next) => {
    const files = ctx.req.files;

    for (let file of files) {
        const destPath = path.join(file.destination, file.filename);
        Jimp.read(file.path).then(image => {
            image.resize(1280, Jimp.AUTO).write(`${destPath}-large`),
            image.resize(640, Jimp.AUTO).write(`${destPath}-middle`),
            image.resize(320, Jimp.AUTO).write(`${destPath}-small`)
        });
    }

    await next();
}

module.exports = {
    avatarHandler,
    pictureHandler,
    pictureResize
}