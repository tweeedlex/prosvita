const Router = require("express");
const router = new Router();

const itemRouter = require("./itemRouter");
const userRouter = require("./userRouter");
const brandRouter = require("./brandRouter");
const typeRouter = require("./typeRouter");
const orderRouter = require("./orderRouter");

router.use("/user", userRouter);
router.use("/order", orderRouter);
router.use("/type", typeRouter);
router.use("/brand", brandRouter);
router.use("/item", itemRouter);

module.exports = router;
