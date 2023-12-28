const express = require("express");
const router = express.Router();

const pollDB = require("../controllers/pollController");

router.get("/", pollDB.getPollsList);

router.get("/:id", pollDB.getPoll);

router.post("/:id/left", pollDB.leftUp);

router.post("/:id/right", pollDB.rightUp);

router.post("/register/:subject", pollDB.pollRegister);

module.exports = router;
