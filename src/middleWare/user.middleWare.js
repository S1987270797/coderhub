const errorTypes = require('../constants/error-type');
const service = require('../service/user.service');
const { md5password } = require('../utils/password-handle');

// 为了处理输入用户名或密码格式问题
const verifyUser = async (ctx, next) => {
    // 1.获取用户名与密码
    const { name, password } = ctx.request.body;

    // 2.验证用户名与密码
    if (!name || !password) {
        console.log('发生了错误');
        const error = new Error(errorTypes.USERNAME_OR_PASSWORD_IS_REQUIRED);
        return ctx.app.emit('errorR', error, ctx); // 发射一个错误, 顺便return结束函数.
    }

    // 判断这次注册的用户名是没有被注册过
    const result = await service.getUserByName(name);
    if (result.length) { // 有内容代表里面有数据, 也代表里面有这个用户(用name查)
        console.log('发生了用户名重复的错误');
        const error = new Error(errorTypes.USERNAME_IS_ALREADY_EXISTS);
        return ctx.app.emit('errorR', error, ctx);
    }

    await next(); // 使用await之后next() 会变为异步任务.
}


// 对密码进行加密
const handlePassword = async (ctx, next) => {
    const { password } = ctx.request.body;
    ctx.request.body.password = md5password(password);

    await next();
}

module.exports = {
    verifyUser,
    handlePassword,
};