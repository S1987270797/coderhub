const Router = require('koa-router');
const { 
    login,
    success
 } = require('../controller/auth.controller.js');
const {
    verifyLogin,
    verifyAuth
} = require('../middleWare/auth.middleWare')

const authRouter = new Router();

// 用户输入账号密码登入的接口, 成功登入后即颁发令牌token.
authRouter.post('/login', verifyLogin, login); 
// 写一个测试接口, 测试利用private颁发的token能否被public_key解析
authRouter.get('/test', verifyAuth, success);

module.exports = authRouter;