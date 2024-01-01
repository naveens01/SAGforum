import { useEffect, useState } from "react";
import { FcLike } from "react-icons/fc";
import { AiOutlineHeart } from "react-icons/ai";
import axios from "../utlis/axiosClient";

const Answer = ({ answerObj, questionId, setData }) => {
  const [liked, SetLiked] = useState(false);

  const handleLike = () => {
    axios
      .post("/api/like", {
        questionId,
        answerId: answerObj._id,
        count: liked ? -1 : 1,
      })
      .then((res) => {
        setData((prev) =>
          prev.map((obj) => {
            if (obj._id != questionId) return obj;
            const ansRef = obj.answers.find((pre) => pre._id == answerObj._id);
            ansRef.like = ansRef.like + (liked ? -1 : 1);
            return obj;
          })
        );
      })
      .catch(() => {});
  };

  return (
    <div className="answer-element">
      <div className="answer-row-one">
        <div className="answered-by">{answerObj.answeredBy}</div>
        <div
          onClick={() => {
            SetLiked((prev) => !prev);
            handleLike();
          }}
          className="like-container"
        >
          {liked ? <FcLike /> : <AiOutlineHeart />} <span>{answerObj.like}</span>
        </div>
      </div>
      <div className="answer-date">
        answered on <span></span>
        {new Date(answerObj.answerDate).toLocaleString("default", {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </div>
      <div className="answer">{answerObj.answer}</div>
    </div>
  );
};

export default Answer;
