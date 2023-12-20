const express = require('express');
const router = express.Router();

const mongoDB = require('../controllers/mongoController');

router.get('/count', async (req, res) => {
  const counts = await mongoDB.getCounts();
  res.header('Access-Control-Allow-Origin', '*');
  res.send(counts);
});

router.post('/inccount', async (req, res) => {
  const msg = await mongoDB.incCounts();
  res.header('Access-Control-Allow-Origin', '*');
  res.send(JSON.stringify(msg));
});

router.post('/setdata', async (req, res) => {
  const msg = await mongoDB.setData();
  res.header('Access-Control-Allow-Origin', '*');
  res.send(JSON.stringify(msg));
});

router.get('/getdata', async (req, res) => {
  const data = await mongoDB.getData();
  res.header('Access-Control-Allow-Origin', '*');
  res.send(data);
});

module.exports = router;
