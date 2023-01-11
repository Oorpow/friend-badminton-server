const connetion = require('../app/database')

class playerService {
	async findAll() {
        const statement = `
            SELECT p.id, p.name, p.smallImg, p.description, p.bannerImg, p.cnName, p.avatar,
                JSON_ARRAYAGG(JSON_OBJECT('id', e.id, 'name', e.name, 'img', e.img)) equipmentList
            FROM player p
            LEFT JOIN player_con_equipment pce ON p.id = pce.pid
            LEFT JOIN equipment e ON pce.eid = e.id
            GROUP BY p.id;
        `
        try {
            const res = await connetion.execute(statement)
            return res[0]
        } catch (error) {
            console.log(error)
        }
	}
	async findOne(id) {
        // 创建一个球员对象
        const playerObj = {}

        // 获取球员信息
        const getPlayer = `
            SELECT * FROM player p
            where id = ?;
        `
        // sql语句查询 球员的装备  赋值给球员装备数组
        const getPlayerEquipment = `
            SELECT e.id, e.name, e.img
            FROM player p, equipment e, player_con_equipment pce
            WHERE p.id = pce.pid AND pce.eid = e.id AND p.id = ?;
        `
        // sql 语句查询 球员的荣耀  赋值给球员荣耀数组
        const getPlayerHonor = `
            SELECT h.id, h.name, h.year FROM
            player p, honor h 
            WHERE p.id = h.pid AND p.id = ?;
        `

        try {
            const [player] = await connetion.execute(getPlayer, [id])
            const [equipmentList] = await connetion.execute(getPlayerEquipment, [id])
            const [honorList] = await connetion.execute(getPlayerHonor, [id])

            // 将上面两个数组 分别赋值给 球员对象里面的 equipment 字段 和 honor字段
            playerObj.id = player[0].id
            playerObj.name = player[0].name
            playerObj.description = player[0].description
            playerObj.bannerImg = player[0].bannerImg
            playerObj.equipmentList = equipmentList
            playerObj.honorList = honorList

            return playerObj
        } catch (error) {
            console.log(error)
        }
	}
}

module.exports = new playerService()
