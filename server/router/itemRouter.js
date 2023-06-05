const Router = require("express")
const router = new Router()
const itemController = require("../controllers/itemController")
const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware")

router.post("/", authMiddleware, roleMiddleware("ADMIN"), itemController.create)
router.post("/rate", authMiddleware, itemController.rate)

router.get("/search", itemController.search)
router.get("/itemInfo", itemController.getItemInfo)
router.get("/", itemController.getAll)
router.get("/:id", itemController.getOne)

router.delete("/", authMiddleware, roleMiddleware("ADMIN"), itemController.delete)
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), itemController.deleteOne)

module.exports = router
