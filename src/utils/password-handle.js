const crypto = require('crypto');

const md5password = (password) => {
    const md5 = crypto.createHash('md5'); // 创建一个md5格式的对象
    const result = md5.update(password).digest('hex'); // 消化为16进制
    return result;
}

module.exports = {
    md5password
}