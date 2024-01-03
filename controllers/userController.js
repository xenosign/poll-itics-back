const mongoClient = require("../mongoConnect");
const crypto = require("crypto");

const _client = mongoClient.connect();

function encrypt(text, key) {
  const cipher = crypto.createCipher("aes-256-cbc", key);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

const getUserInfo = async (req, res) => {
  try {
    const client = await _client;

    const userDB = client.db("poll-itics").collection("users");
    const userInfo = await userDB.findOne({
      code: req.body.code,
    });

    const userInfoStr = JSON.stringify(userInfo);
    res.status(200).send(userInfoStr);
  } catch (err) {
    console.log("ERROR: ", err);
    res.status(400).send("회원 정보 조회 문제 발생");
  }
};

const userLogin = async (req, res) => {
  try {
    const client = await _client;
    const userInfo = req.body;
    const userDB = client.db("poll-itics").collection("users");
    const userExists = await userDB.findOne({
      kakaoId: userInfo.kakaoId,
    });

    if (!userExists) return res.status(202).send("회원 가입 필요");

    const userCode = userExists.code;
    return res.status(200).send(userCode);
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
    const code = encrypt(String(idCounter), String(userInfo.kakaoId));

    const userDB = client.db("poll-itics").collection("users");
    const newUser = {
      id: idCounter,
      code: code,
      kakaoId: userInfo.kakaoId,
      nickname: userInfo.nickname,
      email: userInfo.email,
      histories: {},
      registerdAt: new Date(),
      updateAt: new Date(),
    };

    await userDB.insertOne(newUser);

    const newUserStr = JSON.stringify(newUser);

    res.status(200).send(newUserStr);
  } catch (err) {
    console.log("ERROR: ", err);
    res.status(400).send("회원가입 문제 발생");
  }
};

module.exports = { getUserInfo, userLogin, userRegister };
