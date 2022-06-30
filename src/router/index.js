const fs = require('fs');

/* const useRoutes = (app) => {
    fs.readdirSync(__dirname).forEach(file => { // 读取这个目录的文件，返回一个数据， 遍历数组
        if (file == 'index.js') return; // 碰到return不要进行操作
        const router = require(`./${file}`);
        app.use(router.routes());
        app.use(router.allowedMethods());
    })
} */

// 变得美观
const useRoutes = function () {
    fs.readdirSync(__dirname).forEach(file => { // 读取这个目录的文件，返回一个数据， 遍历数组
        if (file == 'index.js') return; // 碰到return不要进行操作
        const router = require(`./${file}`);
        this.use(router.routes());
        this.use(router.allowedMethods());
    })
}

module.exports = useRoutes;