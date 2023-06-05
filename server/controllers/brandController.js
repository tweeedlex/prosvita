const { Brand, Item } = require("../models")

class BrandController {
    async create(req, res) {
        try {
            res.header("Access-Control-Allow-Origin", "*")
            const { name } = req.body
            const brand = await Brand.create({ name })
            return res.json(brand)
        } catch (e) {
            console.log(e)
            res.status(400).json(e)
        }
    }

    async getAll(req, res) {
        try {
            res.header("Access-Control-Allow-Origin", "*")
            const brands = await Brand.findAll()
            return res.json(brands)
        } catch (e) {
            console.log(e)
            res.status(400).json(e)
        }
    }

    async getOne(req, res) {
        try {
            res.header("Access-Control-Allow-Origin", "*")
            const { id } = req.params
            const brand = await Brand.findOne({ where: { id } })
            return res.json(brand.name)
        } catch (e) {
            console.log(e)
            res.status(400).json(e)
        }
    }

    async delete(req, res) {
        try {
            res.header("Access-Control-Allow-Origin", "*")
            const { id } = req.params
            const brand = await Brand.findOne({ where: { id: +id } })
            if (!brand) {
                return res.status(400).json({ message: "Invalid id" })
            }

            const items = await Item.findAll({ where: { brandId: +id } })
            if (items.length) {
                await Item.destroy({ where: { brandId: +id } })
            }

            await Brand.destroy({ where: { id: +id } })
            return res.status(200).json({ message: "You deleted brand with id " + id })
        } catch (e) {
            console.log(e)
            res.status(400).json(e)
        }
    }
}

module.exports = new BrandController()