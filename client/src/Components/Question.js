import axios from "../utlis/axiosClient";
import { useRef, useState } from "react";
import { BsFillCaretDownFill } from "react-icons/bs";
import Answer from "./Answer";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthUser } from "react-auth-kit";

const Question = ({ obj, setData }) => {
  const [answerVisible, SetAnswerVisible] = useState(false);
  const [answerInputVisible, setAnswerInputVisible] = useState(false);
  const auth = useAuthUser();

  const nameRef = useRef();
  const answerRef = useRef();

  const handleAnswerUpload = (id) => {
    // if (!nameRef.current.value || !answerRef.current.value) {
    if (!answerRef.current.value) {
      alert("Name and Answer is required!");
      return;
    }
    nameRef.current.value = auth().firstName;

    axios
      .post(`/api/answer/${id}`, {
        answer:
          answerRef.current.value.charAt(0).toUpperCase() +
          answerRef.current.value.slice(1),
        answeredBy:
          nameRef.current.value.charAt(0).toUpperCase() +
          nameRef.current.value.slice(1),
      })
      .then((res) => {
        setData(res.data);
        nameRef.current.value = "";
        answerRef.current.value = "";
        setAnswerInputVisible(false);
      });
  };

  return (
    <div className="question-element">
      <div className="question-title">{obj.question}</div>
      <div className="question-date">
        asked by <div className="asked-by-text">{obj.askedBy}</div>{" "}
        <span></span>
        {new Date(obj.questionDate).toLocaleString("default", {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </div>
      <div
        className="view-answer-btn"
        onClick={() => SetAnswerVisible((prev) => !prev)}
      >
        View answers{" "}
        <BsFillCaretDownFill
          className={
            answerVisible
              ? "view-answer-dropdown-icon active"
              : "view-answer-dropdown-icon"
          }
        />
      </div>
      {answerVisible && (
        <div
          layout="size"
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          exit={{ height: 0 }}
          transition={{ type: "tween", duration: 1 }}
          className="answer-container"
        >
          {obj.answers.length === 0
            ? "No answers yet"
            : obj.answers.map((answerObj) => (
                <Answer
                  setData={setData}
                  key={answerObj._id}
                  questionId={obj._id}
                  answerObj={answerObj}
                />
              ))}
        </div>
      )}

      {answerInputVisible && (
        <div className="form-container answer-upload">
          <input
            ref={nameRef}
            style={{ display: "none" }}
            placeholder="Your Name"
            type="text"
          />
          <textarea ref={answerRef} placeholder="Share Your Answer"></textarea>
        </div>
      )}

      <div className="btn-container">
        {answerInputVisible ? (
          <div className="upload-cancel-btn-container">
            <button onClick={() => handleAnswerUpload(obj._id)}>
              Post your answer
            </button>
            <button
              className="cancel-btn"
              onClick={() => setAnswerInputVisible(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => setAnswerInputVisible(true)}>
            Write your answer
          </button>
        )}
      </div>
    </div>
  );
};

export default Question;
