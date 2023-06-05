const { User, Basket } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const uuid = require("uuid").v4;

const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class UserController {
  async registration(req, res) {
    try {
      // validation
      res.header("Access-Control-Allow-Origin", "*");
      const { uid, email } = req.body;

      const candidate = await User.findOne({ where: { email } });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      }

      const user = new User({ id: uid, email, role: "USER" });
      await user.save();

      return res.status(200).json({ message: "You succesfully registered" });
    } catch (e) {
      console.log(e);
      return res.status(400).json(e);
    }
  }

  async login(req, res) {
    try {
      res.header("Access-Control-Allow-Origin", "*");
      const { uid } = req.body;

      const user = await User.findOne({ where: { id: uid } });
      if (!user) {
        return res.status(400).json({ message: "User was not found" });
      }

      const token = generateJwt(user.id, user.email, user.role);
      return res.json(token);
    } catch (e) {
      console.log(e);
      res.status(400).json(e);
    }
  }

  async loginWithGoogle(req, res) {
    try {
      const { email } = req.body;
      let token;

      const userCandidate = await User.findOne({ where: { email } });
      if (userCandidate) {
        token = generateJwt(
          userCandidate.id,
          userCandidate.email,
          userCandidate.role
        );
      } else {
        const user = await User.create({
          email,
          password: uuid(),
          role: "USER",
        });
        token = generateJwt(user.id, user.email, user.role);
        await Basket.create({ userId: user.id });
      }

      return res.json(token);
    } catch (e) {
      console.log(e);
    }
  }

  async getRole(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    return res.json(req.user.role);
  }

  async getEmail(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    return res.json(req.user.email);
  }

  async check(req, res) {
    const token = generateJwt(req.user.id, req.user.email, req.user.role);
    return res.json(token);
  }
}

module.exports = new UserController();
