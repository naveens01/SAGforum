const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const Modals = require("./Modal");
const Question = Modals.Question;
const User = Modals.User;
const jwt = require("jsonwebtoken");
mongoose.set("strictQuery", false);
require("dotenv").config()

app.use(cors({origin:'https://naveen.dofreshmind.com/',credentials:true}));
app.use(express.json());

//app.use(express.static("./client/build",""))

// const uri = 'mongodb+srv://naveens123:naveen123@cluster0.htdnaff.mongodb.net/';

// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//    .then(() => console.log('Connected to MongoDB Atlas'))
//    .catch(error => console.error('Error connecting to MongoDB Atlas', error));

//mongoose.connect('mongodb://mongo-container:27017/qnforum', { useNewUrlParser: true });

app.get("/api/data", async (req, res) => {
  const questions = await Question.find().sort({ _id: -1 });
  res.json(questions);
});

app.post("/api/question", async (req, res) => {
  req.body.questionDate = Date.now();
  const newQuestion = new Question(req.body);
  try {
    await newQuestion.save();
    res.json(await Question.find().sort({ _id: -1 }));
  } catch (error) {
    res.status(403).send("Something went wrong");
  }
});

app.post("/api/answer/:id", async (req, res) => {
  const obj = await Question.findById(req.params.id);
  obj.answers.push({ ...req.body, like: 0, answerDate: Date.now() });
  try {
    await obj.save();
    res.json(await Question.find().sort({ _id: -1 }));
  } catch (error) {
    res.status(403).send("Something went wrong");
  }
});

app.post("/api/like", async (req, res) => {
  const obj = await Question.findById({ _id: req.body.questionId });

  const ansObj = obj.answers.find((prev) => prev._id == req.body.answerId);
  ansObj.like = ansObj.like + req.body.count;
  try {
    await obj.save();
    res.json({ message: "ok" });
  } catch (error) {
    res.status(403).send("Something went wrong");
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const userDetails = await User.findOne({ email: email });
  if (!userDetails) {
    res.status(404).send("User Not Found");
    return;
  }
  if (userDetails.password !== password) {
    res.status(401).send("Incorrect email or password");
    return;
  }
  const jwtToken = jwt.sign(
    {
      email: userDetails.email,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
    },
    "tempKey",
    { expiresIn: 60 * 60 }
  );
  res.json({
    message: "Welcome back",
    jwt: jwtToken,
    email: userDetails.email,
    firstName: userDetails.firstName,
    lastName: userDetails.lastName,
  });
});

app.post("/api/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const user = new User(req.body);
  try {
    await user.save();
    const newUser = await User.findOne({ email: email });
    res.send(newUser);
  } catch (e) {
    console.log("Error in saving user", e);
    res.status(500).send("Error occured while saving the user reocrd");
  }
});


app.get("/api/hi", (req, res) => {
  res.send("hi");
});

mongoose.connect('mongodb://mongo:27017/qn').then(() => {
  console.log("Connected to DB");
})
.catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log("Server started %d.....", PORT);
});
