const jwt = require('jsonwebtoken');

const { PUBLIC_KEY } = require('../app/config');
const errorTypes = require('../constants/error-type');
const UserService = require('../service/user.service');
const AuthSerive = require('../service/auth.service');
const { md5password } = require('../utils/password-handle');

const verifyLogin = async (ctx, next) => {
    // 1.获取用户名和密码
    const { name, password } = ctx.request.body;

    // 2.判断用户名是否为空
    if (!name || !password) {
        console.log('发生了错误');
        const error = new Error(errorTypes.USERNAME_OR_PASSWORD_IS_REQUIRED);
        return ctx.app.emit('errorR', error, ctx); // 发射一个错误, 顺便return结束函数.
    }

    // 3.判断用户是否存在(我们在登录界面, 不存在报错)
    const result = await UserService.getUserByName(name);
    const user = result[0]; // 拿到的是一个对象, 这个是从数据库查出来的. 与request.body的name和password不是同一个东西

    console.log(user + 'user');

    /* 
    result
    [
        BinaryRow {
            id: 6,
            name: 'green',
            password: '202cb962ac59075b964b07152d234b70',
            createAt: 2021 - 08 - 30T02: 32: 01.000Z,
            updateAt: 2021 - 08 - 30T02: 32: 01.000Z
        }
    ] 
    */

    if (!user) { // 有内容代表里面有数据, 也代表里面有这个用户(用name查)
        console.log('发生了用户名不存在的错误');
        const error = new Error(errorTypes.USERNAME_IS_NOT_EXISTS);
        return ctx.app.emit('errorR', error, ctx);
    }

    // 4.判断密码时候和数据库中的密码是一致的(加密)
    // 用request的password 与 数据库中通过name查到的password比较.
    // 两个密码都使用md5(message digest 单项散列函数), 将其转换为hash值,再判断是否一致, 一致就代表是相同的密码
    if (md5password(password) !== user.password) {
        console.log('密码不正确~');
        const error = new Error(errorTypes.PASSWORD_IS_INCORRECT);
        return ctx.app.emit('errorR', error, ctx);
    }

    ctx.user = user;
    await next();
}

const verifyAuth = async (ctx, next) => {
    console.log("进入验证授权的middleware~");
    // 1.获取token
    const authorization = ctx.headers.authorization;
    // 没有携带token的情况
    if (!authorization) {
        const error = new Error(errorTypes.NONE_AUTHORIZATION);
        return ctx.app.emit('errorR', error, ctx);
    }

    // 将用户传过来的token处理一下
    const token = authorization.replace("Bearer ", "");

    // 2.验证token
    // 用公钥解析用私钥颁发的token
    // 公钥可以解析所有用私钥颁发的token， 私钥不能解析公钥颁发的token
    try {
        const result = jwt.verify(token, PUBLIC_KEY, {
            algorithms: ["RS256"],
        });
        // 最好不要将next()放在try里面, 因为next()函数也会被try捕获到.
        // 可以直接给catch的最后一行加上 return即可, return会跳出整个函数自然不会执行下面的代码
        // await next();

        // 检验授权成功后给ctx赋值一个user, 方便给接下来的操作,读取是谁进来了(userID, name).
        // 谁用了我这个中间并且调用了我的next 你的下一个中间件就可以使用这个ctx.user;
        ctx.user = result;
    } catch (err) {
        const error = new Error(errorTypes.UNAUTHORIZED);
        return ctx.app.emit('errorR', error, ctx);
    }
    await next();
}

// 验证是否具有权限操作此条数据
const verifyPermission = async (ctx, next) => {
    // 拿到用户id 与 commentId的userId对比, 一致的话可以修改
    // 1.拿到commentId与当前登录的user的Id
    // const { momentId } = ctx.request.params;
    let tableName = Object.keys(ctx.request.params)[0];
    const fieldId = ctx.request.params[tableName];
    tableName = tableName.replace("Id", ''); // 这个才是真正的表名
    const loginUserId = ctx.user.id; // 当前使用的用户id

    // 2.去数据库的moment表对比id与userId
    // 需要在数据库中操作的最后都捕获一下遗产
    try {
        const result = await AuthSerive.checkMomentCanDo(tableName, fieldId, loginUserId); // 去数据库中比对数据
        /* if (!result) { // 比对不成功的情况
            const error = new Error(errorTypes.NO_PERMISSION);
            return ctx.app.emit("errorR", error, ctx);
            // 这样写略显咯嗦
        } */
        if (!result) { throw new Error() }; // 这里抛出异常就会被下面的catch捕获到. 这样我们就可以创建一样的错误.

        // await next(); 
        // 最好也不要把next()函数写在try里面,
        //  因为next()后面的函数的错误也会在这里捕获到,造成调试上的不便
    } catch (err) {
        const error = new Error(errorTypes.NO_PERMISSION);
        return ctx.app.emit("errorR", error, ctx);
    }
    await next(); // catch里面已经return了
}

module.exports = {
    verifyLogin,
    verifyAuth,
    verifyPermission
}