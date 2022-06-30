const service = require('../service/label.service');

// 验证是否存在某个标签,没有就添加这个标签
const verifyLabelExists = async (ctx, next) => {
    const { labels } = ctx.request.body;

    // 去数据库查询是否有这个标签(name)

    const newLabels = []; // 所有要添加到moment的labels

    for (let name of labels) { // 遍历用户需要设置这条动态的所有标签(前端传过来的)
        const labelResult = await service.getLabelByname(name); // 查询数据库是否有这条数据
        if (labelResult.length === 0) { // 没有这个标签
            const result = await service.create(name); // 创建
            newLabels.push({ labelId: result.insertId, name }); // 获取新插入的label的信息
        } else {
            newLabels.push({ labelId: labelResult[0].id, name });
        }
    }

    ctx.newLabels = newLabels;

    await next();
}

module.exports = {
    verifyLabelExists
}