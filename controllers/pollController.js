const mongoClient = require("../mongoConnect");

const _client = mongoClient.connect();

const LIMIT_MINUTES = Number(process.env.LIMIT_MINUTES);
const LIMIT_DAYS = Number(process.env.LIMIT_DAYS);

const getPollsList = async (req, res) => {
  try {
    const client = await _client;
    const pollDB = client.db("poll-itics").collection("polls");
    const pollsList = await pollDB.find({}).limit(10).toArray();
    res.status(200).json(pollsList);
  } catch (err) {
    console.log("ERROR: ", err);
    res.status(500).send("투표 목록 조회 문제 발생");
  }
};

const getPoll = async (req, res) => {
  try {
    const pollId = req.params.id;
    const client = await _client;
    const pollDB = client.db("poll-itics").collection("polls");
    const pollInfo = await pollDB.findOne({ id: Number(pollId) });

    res.status(200).json(pollInfo);
  } catch (err) {
    console.log("ERROR: ", err);
    res.status(500).send("투표 정보 조회 문제 발생");
  }
};

const leftUp = async (req, res) => {
  try {
    const pollId = req.params.id;
    const userCode = req.body.code;

    const client = await _client;
    const pollDB = client.db("poll-itics").collection("polls");
    const userDB = client.db("poll-itics").collection("users");

    const pollInfo = await pollDB.findOne({ id: Number(pollId) });
    const votedList = pollInfo.list;
    const isVoted = votedList.includes(userCode);

    const userInfo = await userDB.findOne({ code: userCode });
    const voteInfo = userInfo.histories[`${pollId}`];

    if (voteInfo !== undefined && voteInfo !== "") {
      const tmpArr = voteInfo.split("/");
      const limitTimeStr = tmpArr[1];
      const limitTime = new Date(limitTimeStr);
      const now = new Date();

      if (limitTime > now) {
        console.log("재투표 허용 시간이 지나지 않았습니다.");
        return res.status(400).send("재투표 허용 시간이 지나지 않았습니다.");
      }
    }

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
          $push: { list: userCode },
        }
      );
    }

    const limitTime = new Date();
    limitTime.setSeconds(0);
    // limitTime.setMinutes(limitTime.getMinutes() + LIMIT_MINUTES);
    limitTime.setDate(limitTime.getDate() + LIMIT_DAYS);

    await userDB.findOneAndUpdate(
      { code: userCode },
      { $set: { [`histories.${pollId}`]: `L/${limitTime}` } }
    );

    return res.status(200).send("투표 완료");
  } catch (err) {
    console.log("ERROR: ", err);
    return res.status(500).send("서버 문제 발생");
  }
};

const rightUp = async (req, res) => {
  try {
    const pollId = req.params.id;
    const userCode = req.body.code;

    const client = await _client;
    const pollDB = client.db("poll-itics").collection("polls");
    const userDB = client.db("poll-itics").collection("users");

    const pollInfo = await pollDB.findOne({ id: Number(pollId) });
    const votedList = pollInfo.list;
    const isVoted = votedList.includes(userCode);

    const userInfo = await userDB.findOne({ code: userCode });
    const voteInfo = userInfo.histories[`${pollId}`];

    if (voteInfo !== undefined && voteInfo !== "") {
      const tmpArr = voteInfo.split("/");
      const limitTimeStr = tmpArr[1];
      const limitTime = new Date(limitTimeStr);
      const now = new Date();

      if (limitTime > now) {
        console.log("재투표 허용 시간이 지나지 않았습니다.");
        return res.status(400).send("재투표 허용 시간이 지나지 않았습니다.");
      }
    }

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
          $push: { list: userCode },
        }
      );
    }

    const limitTime = new Date();
    limitTime.setSeconds(0);
    // limitTime.setMinutes(limitTime.getMinutes() + LIMIT_MINUTES);
    limitTime.setDate(limitTime.getDate() + LIMIT_DAYS);

    await userDB.findOneAndUpdate(
      { code: userCode },
      { $set: { [`histories.${pollId}`]: `R/${limitTime}` } }
    );

    return res.status(200).send("투표 완료");
  } catch (err) {
    console.log("ERROR: ", err);
    return res.status(500).send("서버 문제 발생");
  }
};

const pollRegister = async (req, res) => {
  try {
    const subject = req.params.subject;
    const leftSubject = req.params.leftSubject;
    const rightSubject = req.params.rightSubject;
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
      leftSubject,
      rightSubject,
      left: 0,
      right: 0,
      list: [],
      createAt: new Date(),
      updateAt: new Date(),
    });

    res.status(200).send("투표 등록 성공");
  } catch (err) {
    console.log("ERROR: ", err);
    res.status(500).send("투표 등록 실패");
  }
};

module.exports = { getPollsList, getPoll, leftUp, rightUp, pollRegister };
