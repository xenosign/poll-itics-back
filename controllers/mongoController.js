const mongoClient = require('../mongoConnect');

const _client = mongoClient.connect();


const getPolls = async () => {
  const client = await _client;
  const db = client.db('poll-itics').collection('polls');
  const polls = await db.find({}).toArray();
  console.log(polls);
  return polls;
};

module.exports = { getPolls };
