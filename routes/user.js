const express = require("express");
const router = express.Router();

const userDB = require("../controllers/userController");

router.post("/get/", userDB.getUserInfo);
router.post("/login/", userDB.userLogin);
router.post("/register/", userDB.userRegister);

module.exports = router;
