const mongoose = require("mongoose");

const Question = new mongoose.Schema({
  question: String,
  askedBy: String,
  questionDate: {
    type: Number,
  },
  answers: [
    {
      id: String,
      like: Number,
      answeredBy: String,
      answerDate: {
        type: Number,
      },
      answer: String,
    },
  ],
});

const User = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
});

module.exports.Question = mongoose.model("Question", Question);
module.exports.User = mongoose.model("User", User);
