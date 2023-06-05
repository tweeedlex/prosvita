const uuid = require("uuid");
const path = require("path");
const jwt = require("jsonwebtoken");
const { Item, Basket, BasketItem, Type, Brand, Rating } = require("../models");
const { Op } = require("sequelize");

class ItemController {
  async create(req, res) {
    try {
      res.header("Access-Control-Allow-Origin", "*");
      let { name, price, brandId, typeId, info, img } = req.body;
      if (!img) {
        img =
          "https://banksiafdn.com/wp-content/uploads/2019/10/placeholde-image.jpg";
      }
      const item = await Item.create({
        name,
        price,
        brandId,
        typeId,
        info,
        img,
      });
      return res.json(item);
    } catch (e) {
      console.log(e);
      res.status(400).json(e);
    }
  }

  async getAll(req, res) {
    try {
      res.header("Access-Control-Allow-Origin", "*");
      let { brandId, typeId, limit, page, itemList } = req.query;

      page = page || 1;
      limit = Number(limit) || 20;
      let offset = page * limit - limit;

      let items = [];

      if (!brandId && !typeId) {
        items = await Item.findAndCountAll({
          limit,
          offset,
          include: [
            { model: Brand, attributes: ["name"] },
            { model: Type, attributes: ["name"] },
          ],
        });
      }
      if (brandId && !typeId) {
        items = await Item.findAndCountAll({
          where: { brandId },
          limit,
          offset,
          include: [
            { model: Brand, attributes: ["name"] },
            { model: Type, attributes: ["name"] },
          ],
        });
      }
      if (!brandId && typeId) {
        items = await Item.findAndCountAll({
          where: { typeId },
          limit,
          offset,
          include: [
            { model: Brand, attributes: ["name"] },
            { model: Type, attributes: ["name"] },
          ],
        });
      }
      if (brandId && typeId) {
        items = await Item.findAndCountAll({
          where: { brandId, typeId },
          limit,
          offset,
          include: [
            { model: Brand, attributes: ["name"] },
            { model: Type, attributes: ["name"] },
          ],
        });
      }

      if (itemList) {
        itemList = itemList.split(",").filter((item) => item !== "");
        const items = await Item.findAll({
          where: {
            id: itemList,
          },
          include: [
            { model: Brand, attributes: ["name"] },
            { model: Type, attributes: ["name"] },
          ],
        });
        return res.json(items);
      }
      return res.json(items);
    } catch (e) {
      res.status(400).json(e);
      console.log(e);
    }
  }

  async getOne(req, res) {
    try {
      res.header("Access-Control-Allow-Origin", "*");
      const { id } = req.params;
      const item = await Item.findOne({
        where: { id },
        include: [
          { model: Brand, attributes: ["name"] },
          { model: Type, attributes: ["name"] },
        ],
      });
      res.status(200).json(item);
    } catch (e) {
      res.status(400).json(e);
      console.log(e);
    }
  }

  async delete(req, res) {
    try {
      res.header("Access-Control-Allow-Origin", "*");
      let { brandId, typeId } = req.query;

      if (brandId && !typeId) {
        const items = await Item.findAll({ where: { brandId } });
        if (!items.length) {
          return res.status(400).json({ message: "Invalid id" });
        }

        await Item.destroy({ where: { brandId } });
      }
      if (!brandId && typeId) {
        const items = await Item.findAll({ where: { typeId } });
        if (!items.length) {
          return res.status(400).json({ message: "Invalid id" });
        }

        await Item.destroy({ where: { typeId } });
      }
      if (brandId && typeId) {
        const items = await Item.findAll({ where: { brandId, typeId } });
        if (!items.length) {
          return res.status(400).json({ message: "Invalid ids" });
        }

        await Item.destroy({ where: { brandId, typeId } });
      }
      if (!brandId && !typeId) {
        return res.status(400).json({ message: "Invalid request" });
      }

      return res.status(200).json({ message: "Items deleted" });
    } catch (e) {
      res.status(400).json(e);
      console.log(e);
    }
  }

  async deleteOne(req, res) {
    try {
      res.header("Access-Control-Allow-Origin", "*");
      const { id } = req.params;

      const item = await Item.findOne({ where: { id: +id } });
      if (!item) {
        return res.status(400).json({ message: "Invalid id" });
      }

      await Item.destroy({ where: { id } });
      res.status(200).json({ message: "You deleted item with id " + id });
    } catch (e) {
      res.status(400).json(e);
      console.log(e);
    }
  }

  async getItemInfo(req, res) {
    let itemInBasket = false;

    const { itemId } = req.query;
    const item = await Item.findOne({ where: { id: itemId } });

    if (item === null) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const { typeId, brandId } = item;
    const { name: type } = await Type.findOne({ where: { id: typeId } });
    const { name: brand } = await Brand.findOne({ where: { id: brandId } });

    const ratings = await Rating.findAll({ where: { itemId } });
    const averageRating =
      ratings.reduce((acc, rating) => acc + rating.rating, 0) / ratings.length;

    try {
      const token = req.headers.authorization.split(" ")[1];

      const user = jwt.verify(token, process.env.SECRET_KEY);

      const userId = +user.id;
      const basket = await Basket.findOne({ where: { userId } });
      const item = await BasketItem.findOne({
        where: { basketId: basket.id, itemId },
      });

      if (item) {
        itemInBasket = true;
      }

      return res.json({
        type,
        brand,
        itemInBasket,
        rating: averageRating,
        ratingsCount: ratings.length,
      });
    } catch (e) {
      return res.json({
        type,
        brand,
        rating: averageRating,
        ratingsCount: ratings.length,
      });
    }
  }

  async rate(req, res) {
    const { itemId, rating } = req.body;

    const ratingCandidate = await Rating.findOne({
      where: { itemId, userId: req.user.id },
    });
    if (ratingCandidate) {
      await Rating.update(
        { rating },
        { where: { itemId, userId: req.user.id } }
      );
      return res.json({
        message: "You updated rate of item with id " + itemId,
      });
    }

    await Rating.create({ itemId, rating, userId: req.user.id });
    return res.json({ message: "You rated item with id " + itemId });
  }

  async search(req, res) {
    const { item } = req.query;
    const items = await Item.findAndCountAll({
      where: {
        name: {
          [Op.like]: `%${item}%`,
        },
      },
      include: [
        { model: Brand, attributes: ["name"] },
        { model: Type, attributes: ["name"] },
      ],
    });
    return res.json(items);
  }
}

module.exports = new ItemController();
