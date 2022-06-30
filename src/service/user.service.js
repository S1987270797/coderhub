const connections = require('../app/database'); // 导入连接数据库 工具模块

class UserService {
    async create(user) { // 创建用户
        // 将数据存储到数据库中
        const { name, password } = user;
        const statement = `INSERT INTO user (name, password) VALUES (?, ?);`;

        const result = await connections.execute(statement, [name, password]); // 将数据储存到数据库中

        console.log('将数据存储到数据库中', user);
        return result;
    }

    async getUserByName(name) {
        const statement = `SELECT * FROM user WHERE name=?;`;
        const result = await connections.execute(statement, [name]);
        console.log('通过name查询了数据库~');

        return result[0];
    }

    async updateAvatarUrlByUserId(avatarUrl, userId) {
        const statement = `UPDATE user SET avatar_url = ? WHERE id = ?;`;
        const [result] = await connections.execute(statement, [avatarUrl, userId]);
        return result;
    }
}

module.exports = new UserService();