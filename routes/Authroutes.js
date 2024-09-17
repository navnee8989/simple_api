const express = require("express");
const {
  getAllUsers,
  RegisterUsers,
  addUserController,
} = require("../controllers/Controllers");
const { LoginUser } = require("../controllers/LoginController");
const { authRoutes } = require("./middleWare");

const router = express.Router();

router.get("/getData", getAllUsers);
router.post("/register", RegisterUsers);
router.post("/login", LoginUser);

module.exports = router;
