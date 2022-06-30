const connection = require('../app/database');
class fileService {
    // 储存头像信息到数据库中
    async createAvatar(filename, mimetype, size, userId) {
        const statement = `INSERT INTO avatar (filename, mimetype, size, user_id) VALUES (?, ?, ?, ?);`;
        const result = await connection.execute(statement, [filename, mimetype, size, userId]);
        return result;
    }

    // 更新用户头像
    async updateAvatarInfo(filename, mimetype, size, userId) {
        const statement = `UPDATE avatar SET filename = ? , mimetype = ?, size = ? WHERE user_id = ?;`;
        const [result] = await connection.execute(statement, [filename, mimetype, size, userId]);
        return result;
    }

    // 删除原来的头像,删除数据库里的数据
    async removeAvatar(userId) {
        const statement = `DELETE FROM avatar WHERE user_id = ?;`;
        const [result] = await connection.execute(statement, [userId]);
        return result;
    }

    // 根据用户Id获取它的头像
    async getAvatarByUserId(userId) {
        const statement = `SELECT * FROM avatar WHERE user_id = ?;`;
        const [result] = await connection.execute(statement, [userId]);
        return result[0];
    }

    // 储存动态配图信息
    async createMomentPicture(userId, momentId, filename, mimetype, size) {
        const statement = `INSERT INTO moment_picture (user_id, moment_id, filename, mimetype, size) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await connection.execute(statement, [userId, momentId, filename, mimetype, size]);
        return result;
    }
}

module.exports = new fileService();