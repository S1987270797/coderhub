const Router = require('koa-router');
const { 
    create,
    avatarInfo
 } = require('../controller/user.controller');
const {
    verifyUser,
    handlePassword,
} = require('../middleWare/user.middleWare');

const userRouter = new Router({ prefix: '/user' });

userRouter.post('/', verifyUser, handlePassword, create); // 注册用户
userRouter.get('/:userId/avatar', avatarInfo); // 查看自己的头像

module.exports = userRouter;