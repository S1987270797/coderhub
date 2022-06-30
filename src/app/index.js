const Koa = require('koa');
const bodyparser = require('koa-bodyparser');

// const userRouter = require('../router/user.router'); // 不再需要一个一个导入了
const errorHandler = require('./error-handle');
const useRoutes = require('../router'); // index可以省略

const app = new Koa();

app.useRoutes = useRoutes;

app.use(bodyparser());

app.useRoutes(); // useRoutes(app); // 变得美观些

app.on('errorR', errorHandler); // 我们监听自己抛出的错误, 不要监听node原生自带的错误. 原生自带的错误会提示我们一些语法错误, 方便我们调试.

module.exports = app;