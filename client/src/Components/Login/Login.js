import React, { useState, useEffect } from "react";
import loginstyle from "./Login.module.css";
import "../AuthComman.css";
import axios from "../../utlis/axiosClient";
import { useNavigate, NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import company_logo from "../../assets/company-logo.png";
const { useSignIn } = require("react-auth-kit");
const Login = ({ setUserState, setIsLoginDisplay }) => {
  const navigate = useNavigate();
  const signIn = useSignIn();
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [user, setUserDetails] = useState({
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...user,
      [name]: value,
    });
  };
  const validateForm = (values) => {
    const error = {};
    const regex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.email) {
      error.email = "Email is required";
    } else if (!regex.test(values.email)) {
      error.email = "Please enter a valid email address";
    }
    if (!values.password) {
      error.password = "Password is required";
    }
    if (Object.keys(error).length > 0) {
      toast.error("Validation Failed !", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1200,
      });
      console.log(error);
      return error;
    } else {
      return undefined;
    }
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    const errors = validateForm(user);
    if (errors) {
      setFormErrors(errors);
      return;
    }
    try {
      const response = await axios.post("/api/login", {
        email: user.email,
        password: user.password,
      });
      console.log(response);
      signIn({
        token: response.data.jwt,
        expiresIn: 120, //2hrs
        tokenType: "Bearer",
        authState: {
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
        },
      });
      toast.success("Welcome to SoftwareAG Forum", {
        autoClose: 1500,
        position: toast.POSITION.TOP_CENTER,
      });
      navigate("/");
    } catch (error) {
      toast.error("Error in Login!" + error, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1200,
      });
    }
    setIsSubmit(true);
    // if (!formErrors) {

    // }
  };

  useEffect(() => {
    setIsLoginDisplay(true);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(user);
      axios.post("/api/login", user).then((res) => {
        alert(res.data.message);
        setUserState(res.data.user);
        navigate("/", { replace: true });
      });
    }
    return () => {
      setIsLoginDisplay(false);
    };
  }, [formErrors]);
  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <img src={company_logo} alt="" className="company-img" />
      </div>
      <div className="auth-right">
        <form className="auth-form">
          <div className="auth-heading">Login</div>
          <div className="row">
            <div className="inp-container">
              <label htmlFor="email">Enter Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="sample@softwareag.com"
                onChange={changeHandler}
                value={user.email}
              />
            </div>
            <p className="auth-error">{formErrors.email}</p>
          </div>
          <div className="row">
            <div className="inp-container">
              <label htmlFor="password">Enter Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="******"
                onChange={changeHandler}
                value={user.password}
              />
            </div>
            <p className="auth-error">{formErrors.password}</p>
          </div>
          <div className="row">
            <button className="auth-submit" onClick={loginHandler}>
              Login
            </button>
          </div>
          <NavLink className="auth-redirect" to="/signup">Not yet registered? Register Now</NavLink>
        </form>
      </div>
    </div>
  );
};
export default Login;
