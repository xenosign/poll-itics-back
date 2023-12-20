const mongoClient = require("../mongoConnect");

const _client = mongoClient.connect();

const getPolls = async (id) => {
  try {
    const client = await _client;
    const polls = client.db("poll-itics").collection("polls");
    const pollInfo = await polls.findOne({ id: Number(id) });
    console.log(pollInfo);

    return pollInfo;
  } catch (err) {
    console.log("ERROR: ", err);
  }
};

const leftUp = async (id) => {
  try {
    const client = await _client;
    const polls = client.db("poll-itics").collection("polls");
    await polls.updateOne(
      { id: Number(id) },
      {
        $inc: { left: 1 },
      }
    );
  } catch (err) {
    console.log("ERROR: ", err);
  }
};

const rightUp = async (id) => {
  try {
    const client = await _client;
    const polls = client.db("poll-itics").collection("polls");
    await polls.updateOne(
      { id: Number(id) },
      {
        $inc: { right: 1 },
      }
    );
  } catch (err) {
    console.log("ERROR: ", err);
  }
};

module.exports = { getPolls, leftUp, rightUp };
