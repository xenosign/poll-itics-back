const mongoClient = require("../mongoConnect");

const _client = mongoClient.connect();

const userLogin = async (req, res) => {
  try {
    const client = await _client;
    const userInfo = req.body;
    const userDB = client.db("poll-itics").collection("users");
    const userExists = await userDB.findOne({
      kakaoId: userInfo.kakaoId,
    });

    if (userExists) return res.status(200).send("회원 존재");
    res.status(202).send("회원 가입 필요");
  } catch (err) {
    console.log("ERROR: ", err);
    res.status(400).send("회원 가입 문제 발생");
  }
};

const userRegister = async (req, res) => {
  try {
    const client = await _client;
    const counterDB = client.db("poll-itics").collection("user-counter");
    const counterObj = await counterDB.findOneAndUpdate(
      {},
      { $inc: { userCounter: 1 } }
    );
    const idCounter = counterObj.userCounter;

    const userInfo = req.body;

    const userDB = client.db("poll-itics").collection("users");
    await userDB.insertOne({
      id: idCounter,
      kakaoId: userInfo.kakaoId,
      nickname: userInfo.nickname,
      email: userInfo.email,
      registerdAt: new Date(),
      updateAt: new Date(),
    });

    res.status(200).send("로그인 성공");
  } catch (err) {
    console.log("ERROR: ", err);
    res.status(400).send("로그인 문제 발생");
  }
};

module.exports = { userLogin, userRegister };
