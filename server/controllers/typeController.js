const { Type, Item } = require("../models")

class TypeController {
    async create(req, res) {
        try {
            res.header("Access-Control-Allow-Origin", "*")
            const { name } = req.body
            const type = await Type.create({ name })
            return res.json(type)
        } catch (e) {
            console.log(e)
            res.status(400).json(e)
        }
    }

    async getAll(req, res) {
        try {
            res.header("Access-Control-Allow-Origin", "*")
            const types = await Type.findAll()
            return res.json(types)
        } catch (e) {
            console.log(e)
            res.status(400).json(e)
        }
    }

    async getOne(req, res) {
        try {
            res.header("Access-Control-Allow-Origin", "*")
            const { id } = req.params
            const type = await Type.findOne({ where: { id } })
            return res.json(type.name)
        } catch (e) {
            console.log(e)
            res.status(400).json(e)
        }
    }

    async delete(req, res) {
        try {
            res.header("Access-Control-Allow-Origin", "*")
            const { id } = req.params
            const type = await Type.findOne({ where: { id: +id } })
            if (!type) {
                return res.status(400).json({ message: "Invalid id" })
            }

            const items = await Item.findAll({ where: { typeId: +id } })
            if (items.length) {
                await Item.destroy({ where: { typeId: +id } })
            }

            await Type.destroy({ where: { id: +id } })
            return res.status(200).json({ message: "You deleted type with id " + id })
        } catch (e) {
            console.log(e)
            res.status(400).json(e)
        }
    }
}

module.exports = new TypeController()