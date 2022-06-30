// 为了验证各种权限,且要去数据库里操作 的验证操作
const connection = require('../app/database.js');
class AuthService {
    // 验证用户是否可以操作这条数据
    async checkMomentCanDo(tableName, fieldId, loginUserId) {
        const statement = `
        SELECT * FROM ${tableName} WHERE id = ? AND user_id = ?;
        `;
        const [result] = await connection.execute(statement, [fieldId, loginUserId]); // await必不可少呀
        console.log(result);
        return result.length === 0 ? false : true; // result有内容就是搜索到了数据, 返回true就时可以操作这条moment
    }
}

module.exports = new AuthService();