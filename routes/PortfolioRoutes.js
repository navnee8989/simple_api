const express = require("express");
const { addUserController } = require("../controllers/Controllers");
const router = express.Router();

router.post("/adduser", addUserController);

module.exports = router;
