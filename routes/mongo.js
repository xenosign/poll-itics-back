const express = require('express');
const router = express.Router();

const mongoDB = require('../controllers/mongoController');

router.get('/', async (req, res) => {
  console.log(req.body);
  const polls = await mongoDB.getPolls();
  res.send(polls);
});

module.exports = router;
