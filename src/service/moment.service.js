const connection = require('../app/database');

class MomentSerive {
    async create(userId, content) {
        // 1.将数据插入到数据库中
        const statement = `INSERT INTO moment (content, user_id) VALUES (? , ?)`;

        const result = await connection.execute(statement, [content, userId]);

        console.log("成功向moment插入数据");
        return result;
    }

    async getMomentDetailById(id, APP_HOST, APP_PORT) {
        // const statement = `SELECT * FROM moment WHERE id = ?;`;
        // 查询一条数据返回有关这条数据的所有信息(评论, 标签)
        const statement = ` 
        SELECT
        m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
        #一个对象里面展示发表这个动态的用户的信息
        JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatar_url) author, 
        # 展示动态配图链接
        (SELECT JSON_ARRAYAGG(CONCAT('${APP_HOST}:${APP_PORT}/moment/images/',mp.filename)) FROM moment_picture mp WHERE m.id = mp.moment_id) images,
        # 这条动态有多少个标签
        IF(COUNT(l.id), JSON_ARRAYAGG(
            JSON_OBJECT('id', l.id, 'name', l.name)
        ), null) labelList, 
        # 动态下面所有的评论信息, 每条评论里面还包含了发表评论的用户信息
        (SELECT IF(COUNT(c.id),JSON_ARRAYAGG(
            JSON_OBJECT('id', c.id, 'content', c.content, 'commentId', c.comment_id, 'createTime',c.createAt,
            'user', JSON_OBJECT('id', cu.id, 'name',cu.name, 'avatarUrl', cu.avatar_url)
            )
        ),null) FROM comment c LEFT JOIN user cu ON c.user_id = cu.id) comments 

        FROM moment m
        LEFT JOIN user u ON m.user_id = u.id
        LEFT JOIN moment_label ml ON m.id = ml.moment_id
        LEFT JOIN label l ON ml.label_id = l.id
        WHERE m.id = ?
        GROUP BY m.id;
        `;
        /* const statement = `
        SELECT 
            m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
            JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatarUrl) author,
            JSON_ARRAYAGG(l.name) labels
        FROM moment m
        LEFT JOIN user u ON m.user_id = u.id
        LEFT JOIN moment_label ml ON m.id = ml.moment_id
        LEFT JOIN label l ON ml.label_id = l.id
        WHERE m.id = ?;
        `; */

        const result = await connection.execute(statement, [id]);

        return result[0];
    }

    async getMomentDetailList(offset, size) {
        const statement = `
        SELECT
        m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
            JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatar_url) author, 
            (SELECT COUNT(*) FROM comment c WHERE c.moment_id = m.id) commentCount,
            (SELECT COUNT(*) FROM moment_label ml WHERE ml.moment_id = m.id) labelCount,
            # 展示动态配图链接
            (SELECT JSON_ARRAYAGG(CONCAT('${APP_HOST}:${APP_PORT}/moment/images/',mp.filename)) FROM moment_picture mp WHERE m.id = mp.moment_id) images
        FROM moment m
        LEFT JOIN user u ON m.user_id = u.id
        LIMIT ?, ?;
        `;
        const result = await connection.execute(statement, [offset, size]);

        return result;
    }

    async updateMoment(momentId, content) {
        const statement = `UPDATE moment SET content = ? WHERE id = ?`;
        const result = await connection.execute(statement, [content, momentId]);
        return result;
    }

    async removeMoment(momentId) {
        const statement = `DELETE FROM moment WHERE id = ?;`;
        const result = await connection.execute(statement, [momentId]);
        return result;
    }

    async hasLabel(momentId, labelId) {
        const statement = `SELECT * FROM moment_label WHERE moment_id = ? AND label_id = ?;`;
        const [result] = await connection.execute(statement, [momentId, labelId]);
        return result;
    }

    async attachLabel(momentId, labelId) {
        const statement = `INSERT INTO moment_label (moment_id, label_id) VALUES (?, ?)`;
        const [result] = await connection.execute(statement, [momentId, labelId]);
        return result;
    }

    async getMomentLabels(momentId) {
        const statement = `
        SELECT 
            m.id id, m.content content, m.createAt createTime,
            JSON_ARRAYAGG(l.name) labelList
        FROM moment m
        LEFT JOIN moment_label ml ON m.id = ml.moment_id
        LEFT JOIN label l ON ml.label_id = l.id
        WHERE m.id = ?;
        `;
        const [result] = await connection.execute(statement, [momentId]);
        return result;
    };

    // 根据momentId获取自己所有的配图
    async getMomentPictureByMomentId(momentId) {
        const statement = `
        SELECT * 
        FROM moment_picture
        WHERE moment_id = ?;
        `;
        const [result] = await connection.execute(statement, [momentId]);
        return result;
    }

    async getMomentPictureByFilename(filename) {
        const statement = `
        SELECT * 
        FROM moment_picture
        WHERE filename = ?;
        `;
        const [result] = await connection.execute(statement, [filename]);
        return result[0];
    }
}

module.exports = new MomentSerive();