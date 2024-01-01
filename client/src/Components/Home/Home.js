import { useState, useRef, useEffect } from "react";
import axios from "../../utlis/axiosClient";
import "../../App.css";
import React from "react";
import Question from "../Question";
import { useAuthUser, useSignOut } from "react-auth-kit";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import company_logo from "../../assets/company-logo.png";

//const apiUrl = "http://backendserver-container:5000/api";

function Home() {
  const navigate = useNavigate();
  const nameRef = useRef();
  const questionRef = useRef();
  const [data, setData] = useState([]);
  const auth = useAuthUser();
  const signOut = useSignOut();
  const [loading, setLoading] = useState(true);

  console.log(auth());

  const handleUploadQuestion = () => {
    nameRef.current.value = auth().firstName;
    if (!nameRef.current.value || !questionRef.current.value) {
      alert("Name and Question are required!");
      return;
    }

    const askedBy =
      nameRef.current.value.charAt(0).toUpperCase() +
      nameRef.current.value.slice(1);
    const question =
      questionRef.current.value.charAt(0).toUpperCase() +
      questionRef.current.value.slice(1);

    axios.post("/api/question", { askedBy, question }).then((res) => {
      setData(res.data);
      nameRef.current.value = "";
      questionRef.current.value = "";
    });
  };

  const logout = () => {
    Cookies.remove("_auth_state");
    Cookies.remove("_auth_storage");
    Cookies.remove("_auth_type");
    Cookies.remove("_auth");
    navigate("/login");
  };

  useEffect(() => {
    axios("/api/data").then((res) => {
      setData(res.data);
      setLoading(false);
      console.log(auth().email);
    });
  }, []);

  return (
    <div className="App">
      <div className="header">
        <div className="header-left">
          <img src={company_logo} />
        </div>
        <div className="header-right">
          <div tabIndex={0} className="logo-avatar">
            {auth().firstName.slice(0, 1) ? auth().firstName.slice(0, 1) : "S"}
            <div className="logout-container">
              <button onClick={logout} className="option-item">Logout</button>
            </div>
          </div>
        </div>
      </div>
      <div className="form-container">
        <div className="form-title">Ask a Question</div>
        <div className="form-inp-container">
          <input type="text" ref={nameRef} style={{ display: "none" }} />
          <textarea
            required
            spellCheck="false"
            ref={questionRef}
            type="text"
            placeholder="Detailed explanation of your query"
          ></textarea>
          <button onClick={() => handleUploadQuestion()}>
            Publish Question
          </button>
        </div>
      </div>
      <div className="breaker"></div>
      <div className="answer-container">
        <h2 className="app-heading fixed-width">SAG Forum Questions</h2>
        <div className="notes-container">
          {loading ? (
            <div className="loader"></div>
          ) : data.length === 0 ? (
            <div className="null-question-data">
              No Questions yet ... Be the first to ask question{" "}
            </div>
          ) : (
            data.map((obj) => {
              return <Question setData={setData} key={obj._id} obj={obj} />;
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
