const express = require("express");
const router = express.Router();

const mongoDB = require("../controllers/pollController");

router.get('/', async (req, res) => {
  const pollsList = await mongoDB.getPollsList();
  res.send(pollsList);
})

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const polls = await mongoDB.getPoll(id);
  res.send(polls);
});

router.post("/:id/left", async (req, res) => {
  const id = req.params.id;
  const polls = await mongoDB.leftUp(id);
  res.send("성공");
});

router.post("/:id/right", async (req, res) => {
  const id = req.params.id;
  const polls = await mongoDB.rightUp(id);
  res.send("성공");
});

module.exports = router;
