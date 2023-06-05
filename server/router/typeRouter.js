const Router = require("express")
const router = new Router()
const typeController = require("../controllers/typeController")

router.post("/", authMiddleWare, roleMiddleWare("ADMIN"), typeController.create)
router.get("/", typeController.getAll)
router.get("/:id", typeController.getOne)
router.delete("/:id", authMiddleWare, roleMiddleWare("ADMIN"), typeController.delete)

module.exports = router
