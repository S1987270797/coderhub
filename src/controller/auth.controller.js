const jwt = require('jsonwebtoken');
const { PRIVATE_KEY } = require('../app/config');

class AuthController {
    async login(ctx, next) {
        console.log(ctx.user);
        // 通过验证用户名密码正确, 开始给用户颁发token
        const { id, name } = ctx.user;
        const token = jwt.sign({ id, name }, PRIVATE_KEY, {
            expiresIn: 60 * 60 * 24,
            algorithm: "RS256"
        })

        ctx.body = {
            id,
            name,
            // 因为我们是做后端,不需要考虑前端的发送请求的操作
            // token的消息应该携带在请求头里面(前端处理), 我们使用postman自带的携带token工具
            token, 
        };
    }

    async success(ctx, next) {
        ctx.response.body = "授权成功~";
    }
}

module.exports = new AuthController();