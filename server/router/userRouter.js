const Router = require("express");
const router = new Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/registration", userController.registration);

router.post("/login", userController.login);
router.post("/google", userController.loginWithGoogle);
router.get("/email", authMiddleware, userController.getEmail);
router.get("/auth", authMiddleware, userController.check);
router.get("/", authMiddleware, userController.getRole);

module.exports = router;
