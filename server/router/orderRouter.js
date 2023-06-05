const Router = require("express");
const router = new Router();
const orderController = require("../controllers/orderController");
const roleMiddleware = require("../middleware/roleMiddleware");
const authMiddleWare = require("../middleware/authMiddleware");

router.post("/", orderController.add);
router.delete(
  "/",
  authMiddleWare,
  roleMiddleware("MANAGER"),
  orderController.remove
);
router.put(
  "/",
  authMiddleWare,
  roleMiddleware("MANAGER"),
  orderController.complete
);
router.get("/", authMiddleWare, roleMiddleware("MANAGER"), orderController.get);

module.exports = router;
