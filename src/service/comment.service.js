const connection = require('../app/database')

class commentService {
	async findAllById(id) {
        // 获取某条动态所有的评论
		const statement = `
            SELECT c.id, c.content, c.createAt, c.parent_id, u.id userId, u.name userName, u.avatar
            FROM comment c, user u
            WHERE c.inv_id = ? AND c.user_id = u.id;
        `
		const [res] = await connection.execute(statement, [id])

		const commentList = res.map((item) => {
			item.userInfo = {
				id: item.userId,
				name: item.userName,
				avatar: item.avatar
			}

			delete item.userId
			delete item.userName
			delete item.avatar

			// 说明是某条评论的子评论, 需要找到其父评论，给父评论添加children
			if (item.parent_id !== null) {
				for (let i = 0; i < res.length; i++) {
					let comment = res[i]
					// 找到父评论
					if (comment.id === item.parent_id) {
						comment.children = []
						comment.children.push(item)
					}
				}
			}
			return item
		})
        // 子评论已经添加到父评论的children中了，因此需要再度对原数组进行一个操作，将原来数组中子评论删除掉
        commentList.forEach(item => {
            const targetIndex = commentList.findIndex(sub => sub.parent_id !== null)
            if (targetIndex !== -1) {
                commentList.splice(targetIndex, 1)
            }
        })
		return commentList
	}
	async create(content, invId, parentId, userId) {
		const statement = `
			INSERT INTO comment (content, inv_id, parent_id, user_id) VALUES (?, ?, ?, ?)
		`

		const [res] = await connection.execute(statement, [content, invId, parentId, userId])
		return res
	}
}

module.exports = new commentService()
