const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// 调用完这个就可以从 .env 拿到对应的配置 存在了process.env.APP_PORT里面
dotenv.config();
// console.log(process.env.APP_PORT);

// 使用绝对路径
const PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname, './keys/private.key'));
const PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname, './keys/public.key'));

module.exports = {
    APP_HOST,
    APP_PORT,
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_DATABASE,
    MYSQL_USER,
    MYSQL_PASSWORD
} = process.env;

module.exports.PRIVATE_KEY = PRIVATE_KEY;
module.exports.PUBLIC_KEY = PUBLIC_KEY;