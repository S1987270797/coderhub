const connection = require('../app/database');

class CommentService {
    async create(momentId, userId, content) {
        const statement = `INSERT INTO comment (content, user_id, moment_id) VALUES (?, ? ,?);`;
        const result = await connection.execute(statement, [content, userId, momentId]);
        return result;
    }

    async reply(momentId, userId, content, commentId) {
        const statement = `INSERT INTO comment (content, user_id, moment_id, comment_id) VALUES (?, ? ,? ,?);`;
        const result = await connection.execute(statement, [content, userId, momentId, commentId]);
        return result;
    }

    async update(commentId, content) {
        const statement = `UPDATE comment SET content = ? WHERE id = ?;`;
        const result = await connection.execute(statement, [content, commentId]);
        return result;
    }

    async delete(commentId) {
        const statement = `DELETE FROM comment WHERE id = ?;`;
        const result = await connection.execute(statement, [commentId]);
        return result;
    }

    // 根据moment查询下面有多少条comment, 还要显示是谁发表的评论
    async getCommentListByMomentId(momentId) {
        const statement = `
        SELECT 
            c.id, c.content, c.comment_id commentId, c.createAt createTime,
            JSON_OBJECT('id', u.id, 'name',u.name) user
        FROM comment c
        LEFT JOIN user u ON u.id = c.user_id
        WHERE moment_id = ?;
        `;
        const [result] = await connection.execute(statement, [momentId]);
        return result;
    }

}

module.exports = new CommentService();