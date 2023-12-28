const mongoClient = require("../mongoConnect");

const _client = mongoClient.connect();

const getPollsList = async () => {
  try {
    const client = await _client;
    const pollDB = client.db("poll-itics").collection("polls");
    const pollsList = await pollDB.find({}).limit(10).toArray();

    return pollsList;
  } catch (err) {
    console.log("ERROR: ", err);
  }
};

const getPoll = async (id) => {
  try {
    const client = await _client;
    const pollDB = client.db("poll-itics").collection("polls");
    const pollInfo = await pollDB.findOne({ id: Number(id) });

    return pollInfo;
  } catch (err) {
    console.log("ERROR: ", err);
  }
};

const leftUp = async (pollId, userId) => {
  try {
    const client = await _client;
    const pollDB = client.db("poll-itics").collection("polls");

    const pollInfo = await pollDB.findOne({ id: Number(pollId) });
    const votedList = pollInfo.list;
    const isVoted = votedList.includes(userId);

    if (isVoted) {
      await pollDB.updateOne(
        { id: Number(pollId) },
        {
          $inc: { left: 1, right: -1 },
        }
      );
    } else {
      await pollDB.updateOne(
        { id: Number(pollId) },
        {
          $inc: { left: 1 },
          $push: { list: userId },
        }
      );
    }

    const userDB = client.db("poll-itics").collection("users");
    await userDB.findOneAndUpdate(
      { id: userId },
      { $set: { [`histories.${pollId}`]: `L/${new Date()}` } }
    );
  } catch (err) {
    console.log("ERROR: ", err);
  }
};

const rightUp = async (pollId, userId) => {
  try {
    const client = await _client;
    const pollDB = client.db("poll-itics").collection("polls");

    const pollInfo = await pollDB.findOne({ id: Number(pollId) });
    const votedList = pollInfo.list;
    const isVoted = votedList.includes(userId);

    if (isVoted) {
      await pollDB.updateOne(
        { id: Number(pollId) },
        {
          $inc: { right: 1, left: -1 },
        }
      );
    } else {
      await pollDB.updateOne(
        { id: Number(pollId) },
        {
          $inc: { right: 1 },
          $push: { list: userId },
        }
      );
    }

    const userDB = client.db("poll-itics").collection("users");
    await userDB.findOneAndUpdate(
      { id: userId },
      { $set: { [`histories.${pollId}`]: `R/${new Date()}` } }
    );
  } catch (err) {
    console.log("ERROR: ", err);
  }
};

const pollRegister = async (subject) => {
  try {
    const client = await _client;
    const counterDB = client.db("poll-itics").collection("poll-counter");
    const counterObj = await counterDB.findOneAndUpdate(
      {},
      { $inc: { pollCounter: 1 } }
    );
    const pollCounter = counterObj.pollCounter;

    const pollDB = client.db("poll-itics").collection("polls");
    await pollDB.insertOne({
      id: pollCounter,
      subject,
      left: 0,
      right: 0,
      list: [],
      createAt: new Date(),
      updateAt: new Date(),
    });
  } catch (err) {
    console.log("ERROR: ", err);
  }
};

module.exports = { getPollsList, getPoll, leftUp, rightUp, pollRegister };
