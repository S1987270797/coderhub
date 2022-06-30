const connection = require('../app/database');

class LabelService {
    async create(name) {
        const statement = `INSERT INTO label (name) VALUES (?);`
        const [result] = await connection.execute(statement, [name]);
        return result;
    }

    async getLabelByname(name) {
        const statement = `SELECT * FROM label WHERE name = ?;`;
        const [result] = await connection.execute(statement, [name]);
        return result; // result是一个数组
    }

    async getList(limit, offset) {
        const statement = `SELECT * FROM label LIMIT ? , ?;`;
        const [result] = await connection.execute(statement, [offset, limit]);
        return result;
    }
}

module.exports = new LabelService();