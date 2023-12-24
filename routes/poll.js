const express = require("express");
const router = express.Router();

const DB = require("../controllers/pollController");

router.get("/", async (req, res) => {
  const pollsList = await DB.getPollsList();
  res.send(pollsList);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const polls = await DB.getPoll(id);
  res.send(polls);
});

router.post("/:id/left", async (req, res) => {
  const id = req.params.id;
  const polls = await DB.leftUp(id);
  res.send("성공");
});

router.post("/:id/right", async (req, res) => {
  const id = req.params.id;
  const polls = await DB.rightUp(id);
  res.send("성공");
});

router.post("/register/:subject", async (req, res) => {
  const subject = req.params.subject;
  await DB.register(subject);
  res.send("성공");
});

module.exports = router;
