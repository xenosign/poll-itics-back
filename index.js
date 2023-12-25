const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { PORT } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const pollRouter = require("./routes/poll");
const userRouter = require("./routes/user");
app.use("/poll", pollRouter);
app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`데이터 통신 서버가 ${PORT}에서 작동 중`);
});
