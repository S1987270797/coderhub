const errorTypes = require('../constants/error-type');

const errorHandler = (error, ctx) => {
    console.log('在app/error-handle 打印的错误信息: ', error.message);
    let status, message;

    switch (error.message) {
        case errorTypes.USERNAME_OR_PASSWORD_IS_REQUIRED:
            status = 400; // Bad Request
            message = '用户名或密码不能为空~'
            break;
        case errorTypes.USERNAME_IS_ALREADY_EXISTS:
            status = 409; // conflict
            message = '用户名重复~'
            break;
        case errorTypes.USERNAME_IS_NOT_EXISTS:
            status = 400; // conflict
            message = '用户名不存在!';
            break;
        case errorTypes.PASSWORD_IS_INCORRECT:
            status = 400; // conflict
            message = '密码错误~';
            break;
        case errorTypes.UNAUTHORIZED:
            status = 401; // 未授权
            message = '授权失败~';
            break;
        case errorTypes.NONE_AUTHORIZATION:
            status = 401; // 没有携带token
            message = 'can not find token~';
            break;
        case errorTypes.NO_PERMISSION:
            status = 401; // 没有权限操作这条数据
            message = '您没有权限!';
            break;
        case errorTypes.REPLY_FAILED:
            status = 401; // 没有权限操作这条数据
            message = '评论失败~ 动态已被删除!';
            break;
        default:
            status = 404;
            message = 'NOT FOUND~';
    }
    ctx.status = status;
    ctx.body = message;
}

module.exports = errorHandler;