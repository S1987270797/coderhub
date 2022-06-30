const Router = require('koa-router');
const {
    verifyAuth,
    verifyPermission,
} = require('../middleWare/auth.middleWare');
const {
    verifyLabelExists
} = require('../middleWare/label.middleware');
const {
    create,
    detail,
    detailList,
    update,
    remove,
    addLabel,
    getLabels,
    momentImage
} = require('../controller/moment.controller.js');

const momentRouter = new Router({ prefix: '/moment' });

momentRouter.post('/', verifyAuth, create); // 发表动态的接口
momentRouter.get('/', detailList);      // 查看多条, 在社区里面.
momentRouter.get('/:momentId', detail); // 查看动态的接口(单条)

// 需要具备两个条件: 1.用户登录  2.用户具备修改这条动态的权限
momentRouter.patch('/:momentId', verifyAuth, verifyPermission, update); // 修改动态接口
momentRouter.delete('/:momentId', verifyAuth, verifyPermission, remove); // 删除动态接口

// 给动态添加标签
// 1.添加之前还要验证label表里是否有这个标签
momentRouter.post('/:momentId/labels', verifyAuth, verifyPermission, verifyLabelExists, addLabel);

// 获取该动态的标签列表
momentRouter.get('/labels/:momentId', getLabels);

// 查看动态大图
momentRouter.get('/images/:filename', momentImage);

module.exports = momentRouter;

