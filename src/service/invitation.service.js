const connection = require('../app/database')
// 1. (封装函数)传入statement, 遍历查询得到的数据，整合出一个userInfo返回
// 2. (封装函数)传入statement以及要添加标签的帖子, 给该帖子添加标签数组

const handleCombineUserWithoutOffset = async (statement, id) => {
	let mainRes = []
	if (id) {
		const [res] = await connection.execute(statement, [id])
		mainRes = [].concat(res)
	}
	const result = mainRes.map((item) => {
		item.userInfo = {
			id: item.id,
			name: item.name,
			avatar: item.avatar,
			space_bg: item.space_bg,
			description: item.description
		}
		delete item.id
		delete item.name
		delete item.avatar
		delete item.space_bg
		delete item.description
		return {
			...item,
		}
	})
	return result
}

// 处理发布者信息
const handleCombineUser = async (statement, id, offset = 1) => {
	let mainRes = []
	if (id) {
		const [res] = await connection.execute(statement, [id, offset])
		mainRes = [].concat(res)
	} else {
		const [res] = await connection.execute(statement, [offset])
		mainRes = [].concat(res)
	}
	const result = mainRes.map((item) => {
		item.userInfo = {
			id: item.id,
			name: item.name,
			avatar: item.avatar,
			space_bg: item.space_bg,
			description: item.description
		}
		delete item.id
		delete item.name
		delete item.avatar
		delete item.space_bg
		delete item.description
		return {
			...item,
		}
	})
	return result
}

// 处理标签数组
const handleCombineTag = async (statement, source) => {
	const [res] = await connection.execute(statement)
	let invitationList = []

	if (Array.isArray(source)) {
		invitationList = [].concat(source)
		res.forEach((item) => {
			invitationList.forEach((inv) => {
				if (item.inv_id === inv.invitation_id) {
					inv.tagList.push({
						id: item.t_id,
						name: item.name,
					})
				}
			})
		})
	} else {
		const tagList = res.filter(item => item.inv_id === source.invitation_id)
		tagList.forEach(item => {
			source.tagList.push({
				id: item.t_id,
				name: item.name
			})
		})
		invitationList.push(source)
	}
	return invitationList
}

// 处理单个帖子的信息
const handleOneInvitation = async (id) => {
	const getUserStatement = `
		SELECT u.id, u.name, u.avatar, u.space_bg, u.description, i.id invitation_id, i.title, i.content, i.img, i.createAt, i.stars
		FROM invitation i, user u
		WHERE i.uid = u.id
		AND i.id = ?
	`
	const getTagStatement = `
		SELECT * FROM tag t, invitation_con_tag it
		WHERE it.t_id = t.id
	`
	// 将发布者信息合并到帖子内
	const [invitation] = await handleCombineUserWithoutOffset(getUserStatement, id)
	invitation.tagList = []
	// 将tag合并到帖子内
	const res = await handleCombineTag(getTagStatement, invitation)
	return res
}

class invitationService {
	// 查询所有帖子信息
	async findAll(pagenum) {
		let offset = (pagenum - 1) * 6

		const getUserstatement = `
			SELECT u.id, u.name, u.avatar, u.description, i.id invitation_id, i.title, i.content, i.img, i.createAt, i.stars
			FROM user u, invitation i
			WHERE u.id = i.uid
			ORDER BY i.createAt DESC
			LIMIT ?,6
		`
		const getTagStatement = `
			SELECT * FROM tag t, invitation_con_tag it
			WHERE it.t_id = t.id
		`
		const getTotalStatement = `
			SELECT u.id, u.name, u.avatar, u.description, i.id invitation_id, i.title, i.content, i.img, i.createAt, i.stars
			FROM user u, invitation i
			WHERE u.id = i.uid
		`

		try {
			const [res] = await connection.execute(getTotalStatement)

			const invitationList = await handleCombineUser(getUserstatement, undefined, offset + '')
			invitationList.forEach(item => {
				item.tagList = []
			})

			const result = await handleCombineTag(getTagStatement, invitationList)
			return {
				total: res.length,
				result
			}
		} catch (error) {
			console.log(error)
		}
	}
	// 按帖子的标签分类
	async findAllByTag(tagId, pagenum) {
		let offset = (pagenum - 1) * 6

		const getUserstatement = `
			SELECT u.id, u.name, u.avatar, i.id invitation_id, i.title, i.content, i.img, i.createAt, i.stars
			FROM user u, invitation i
			WHERE u.id = i.uid
			ORDER BY i.createAt DESC
		`
		const getTagStatement = `
			SELECT * FROM tag t, invitation_con_tag it
			WHERE it.t_id = t.id
		`

		try {
			const invitationList = await handleCombineUser(getUserstatement, undefined, offset)

			invitationList.forEach(item => {
				item.tagList = []
			})

			const result = await handleCombineTag(getTagStatement, invitationList)
			const resultByTag = []

			result.forEach(item => {
				item.tagList.forEach(tag => {
					if (tag.id === Number(tagId)) {
						resultByTag.push(item)
					}
				})
			})
			return {
				total: resultByTag.length,
				result: resultByTag
			}
		} catch (error) {
			console.log(error)
		}
	}
	async findOne(id) {
		try {
			const res = await handleOneInvitation(id)
			return res
		} catch (error) {
			console.log(error)
		}
	}
	// 创建帖子
	async create(title, content, tag, img, uid) {
		const insertInvitationStatement = `
			INSERT INTO invitation (title, content, img, uid)
			VALUES (?, ?, ?, ?)
		`
		const insertTagStatement = `
			INSERT INTO invitation_con_tag (t_id, inv_id)
			VALUES (?, ?)
		`
		try {
			const [res] = await connection.execute(insertInvitationStatement, [
				title,
				content,
				img,
				uid,
			])
			// 选中了标签，循环插入帖子选中的标签到数据库中
			if (tag.length !== 0) {
				tag.forEach(async (item) => {
					await connection.execute(insertTagStatement, [item, res.insertId])
				})
			}
			return res
		} catch (error) {
			console.log(error)
		}
	}
	async findAllByUserId(userId) {
		const getUserstatement = `
			SELECT u.id, u.name, u.avatar, i.id invitation_id, i.title, i.content, i.img, i.createAt, i.stars
			FROM user u, invitation i
			WHERE u.id = i.uid
			AND i.uid = ?
		`
		const getTagStatement = `
			SELECT * FROM tag t, invitation_con_tag it
			WHERE it.t_id = t.id
		`

		try {
			const invitationList = await handleCombineUser(getUserstatement, userId)
			invitationList.forEach(item => {
				item.tagList = []
			})

			const result = await handleCombineTag(getTagStatement, invitationList)
			return result
		} catch (error) {
			console.log(error)
		}
	}
	async findByUserIdAndPageNum(userId, pageNum) {
		let offset = (pageNum - 1) * 6

		const getUserStatement = `
			SELECT u.id, u.name, u.avatar, i.id invitation_id, i.title, i.content, i.img, i.createAt, i.stars
			FROM user u, invitation i
			WHERE u.id = i.uid
			AND i.uid = ?
			ORDER BY i.createAt DESC
			LIMIT ?,6;
		`
		const getTotalStatement = `
			SELECT u.id, u.name, u.avatar, i.id invitation_id, i.title, i.content, i.img, i.createAt, i.stars
			FROM user u, invitation i
			WHERE u.id = i.uid
			AND i.uid = ?
		`
		const getTagStatement = `
			SELECT * FROM tag t, invitation_con_tag it
			WHERE it.t_id = t.id
		`

		try {
			const [res] = await connection.execute(getTotalStatement, [userId])
			const invitationList = await handleCombineUser(getUserStatement, userId, offset + '')
			invitationList.forEach(item => {
				item.tagList = []
			})

			const result = await handleCombineTag(getTagStatement, invitationList)
			return {
				total: res.length,
				result
			}
		} catch (error) {
			console.log(error)
		}
	}
	async patchOneStarsById(userId, invitationId) {
		const addStarStatement = `UPDATE invitation SET stars = stars + 1 WHERE id = ?`
		const checkRecordExists = `SELECT * FROM likes l WHERE l.user_id = ? AND l.invitation_id = ?`
		const insertStarRecord = `INSERT INTO likes (user_id, invitation_id) VALUES (?, ?)`

		try {
			// 检验是否已经存在一条相似的点赞记录
			const [exists] = await connection.execute(checkRecordExists, [userId, invitationId])
			if (exists.length === 0) {
				await connection.execute(addStarStatement, [invitationId])
				await connection.execute(insertStarRecord, [userId, invitationId])
				return true
			}
			return false
		} catch (error) {
			console.log(error)
		}
	}
	async cancelOneStarsById(userId, invitationId) {
		const reduceStarStatement = `UPDATE invitation SET stars = stars - 1 WHERE id = ?`
		const checkRecordExists = `SELECT * FROM likes l WHERE l.user_id = ? AND l.invitation_id = ?`
		const deleteStarRecord = `DELETE FROM likes l WHERE l.user_id = ? AND l.invitation_id = ?`

		try {
			const [exists] = await connection.execute(checkRecordExists, [userId, invitationId])
			
			if (exists.length !== 0) {
				await connection.execute(reduceStarStatement, [invitationId])
				await connection.execute(deleteStarRecord, [userId, invitationId])
				return true
			}
			return false
		} catch (error) {
			console.log(error)
		}
	}
	async findAllStarredByUserId(id) {
		const statement = `SELECT * FROM likes l WHERE l.user_id = ?`
		try {
			const [res] = await connection.execute(statement, [id])
			return res
		} catch (error) {
			console.log(error)
		}
	}
	async findHotList() {
		try {
			const getUserstatement = `
			SELECT u.id, u.name, u.avatar, i.id invitation_id, 
			i.title, i.content, i.img, i.createAt, i.stars, i.starred
			FROM user u, invitation i
			WHERE u.id = i.uid
			ORDER BY i.stars DESC;
		`
		const getTagStatement = `
			SELECT * FROM tag t, invitation_con_tag it
			WHERE it.t_id = t.id
		`
		const invitationList = await handleCombineUser(getUserstatement)
		invitationList.forEach(item => {
			item.tagList = []
		})

		const result = await handleCombineTag(getTagStatement, invitationList)
		return result.slice(0, 5)
		} catch (error) {
			console.log(error);
		}
	}

	async isStarred(userId, invitationId) {
		const checkRecordExists = `SELECT * FROM likes l WHERE l.user_id = ? AND l.invitation_id = ?`
		try {
			const [res] = await connection.execute(checkRecordExists, [userId, invitationId])
			return res.length !== 0
		} catch (error) {
			console.log(error)
		}
	}
	async findAllBySearchVal(val) {
		const statement = `
			SELECT i.id, i.title, i.img
			FROM invitation i WHERE title LIKE CONCAT('%', ?, '%')
		`

		try {
			const [res] = await connection.execute(statement, [val])
			return res
		} catch (error) {
			console.log(error)
		}
	}
	async updateOneById({ id, title, content, img, tag }) {
		const updateInvStatement = `UPDATE invitation SET title = ?, content = ?, img = ? WHERE id = ?;`
		const queryTagStatement = `SELECT * FROM invitation_con_tag WHERE inv_id = ?;`
		const deleteTagStatement = `DELETE FROM invitation_con_tag WHERE inv_id = ?;`
		const insertTagStatement = `
			INSERT INTO invitation_con_tag (t_id, inv_id)
			VALUES (?, ?);
		`

		try {
			await connection.execute(updateInvStatement, [title, content, img, id])
			// 更新用户的标签
			// 1. 获取当前这个帖子原来的tag
			const [originTag] = await connection.execute(queryTagStatement, [id])
			if (originTag.length) {
				// 2. 旧tag存在，则删除原来的tag记录
				await connection.execute(deleteTagStatement, [id])
				// 3. 循环添加新tag
				tag.forEach(async (t) => {
					await connection.execute(insertTagStatement, [t, id])
				})
			} else {
				tag.forEach(async (t) => {
					await connection.execute(insertTagStatement, [t, id])
				})
			}
		} catch (error) {
			console.log(error)
		}
	}
}

module.exports = new invitationService()
