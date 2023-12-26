const express = require("express");
const router = express.Router();

const pollDB = require("../controllers/pollController");

router.get("/", async (req, res) => {
  const pollsList = await pollDB.getPollsList();
  res.send(pollsList);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const polls = await pollDB.getPoll(id);
  res.send(polls);
});

router.post("/:id/left", async (req, res) => {
  const pollId = req.params.id;
  const userId = req.body.userId;
  await pollDB.leftUp(pollId, userId);
  res.send("성공");
});

router.post("/:id/right", async (req, res) => {
  const pollId = req.params.id;
  const userId = req.body.userId;
  await pollDB.rightUp(pollId, userId);
  res.send("성공");
});

router.post("/register/:subject", async (req, res) => {
  const subject = req.params.subject;
  await pollDB.pollRegister(subject);
  res.send("성공");
});

module.exports = router;
