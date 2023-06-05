const Router = require("express")
const router = new Router()
const brandController = require("../controllers/brandController")

router.post("/", authMiddleWare, roleMiddleWare("ADMIN"), brandController.create)
router.get("/", brandController.getAll)
router.get("/:id", brandController.getOne)
router.delete("/:id", authMiddleWare, roleMiddleWare("ADMIN"), brandController.delete)

module.exports = router
