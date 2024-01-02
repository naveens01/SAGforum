import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../../utlis/axiosClient";
import company_logo from "../../assets/company-logo.png";

import { useNavigate, NavLink } from "react-router-dom";
const Register = ({ setIsLoginDisplay }) => {
  const navigate = useNavigate();

  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [user, setUserDetails] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    cpassword: "",
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
    const regex = /^[a-zA-Z0-9._-]+@softwareag\.com$/;
    if (!values.fname) {
      error.fname = "First Name is required";
    }
    if (!values.lname) {
      error.lname = "Last Name is required";
    }
    if (!values.email) {
      error.email = "Email is required";
    } else if (!regex.test(values.email)) {
      error.email = "Invalid Email format (format : user@softwareag.com)";
    }
    if (!values.password) {
      error.password = "Password is required";
    } else if (values.password.length < 4) {
      error.password = "Password must be more than 4 characters";
    } else if (values.password.length > 10) {
      error.password = "Password cannot exceed more than 10 characters";
    }
    if (!values.cpassword) {
      error.cpassword = "Confirm Password is required";
    } else if (values.cpassword !== values.password) {
      error.cpassword = "Confirm password and password should be same";
    }
    if (Object.keys(error).length > 0) {
      toast.error("Validation Failed !", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1200,
      });
      return error;
    } else {
      return undefined;
    }
  };
  const signupHandler = async (e) => {
    e.preventDefault();
    const errors = validateForm(user);
    if (errors) {
      setFormErrors(errors);
    } else {
      try {
        const response = await axios.post("/api/signup", {
          firstName: user.fname,
          lastName: user.lname,
          email: user.email,
          password: user.password,
        });
        toast.success("Registration success. Now login using your password", {
          autoClose: 4000,
          position: toast.POSITION.TOP_CENTER,
        });
        navigate("/login", { replace: true });
      } catch (error) {
        console.log(error);
      }
      setIsSubmit(true);
    }
  };

  useEffect(() => {
    setIsLoginDisplay(true);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(user);
      axios.post("/api/signup", user).then((res) => {
        alert(res.data.message);
        navigate("/login", { replace: true });
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
          <div className="auth-heading">Create your account</div>
          <div className="row">
            <div className="inp-container">
              <label htmlFor="fname">Enter First Name</label>
              <input
                type="text"
                name="fname"
                id="fname"
                placeholder="Naveen"
                onChange={changeHandler}
                value={user.fname}
              />
            </div>
            <p className="auth-error">{formErrors.fname}</p>
          </div>
          <div className="row">
            <div className="inp-container">
              <label htmlFor="lname">Enter Last Name</label>
              <input
                type="text"
                name="lname"
                id="lname"
                placeholder="S"
                onChange={changeHandler}
                value={user.lname}
              />
            </div>
            <p className="auth-error">{formErrors.lname}</p>
          </div>

          <div className="row">
            <div className="inp-container">
              <label htmlFor="email">Enter Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="naveen@softwareag.com"
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
            <div className="inp-container">
              <label htmlFor="cpassword">Confirm Password</label>
              <input
                type="password"
                name="cpassword"
                id="cpassword"
                placeholder="******"
                onChange={changeHandler}
                value={user.cpassword}
              />
            </div>
            <p className="auth-error">{formErrors.cpassword}</p>
          </div>
          <div className="row">
          <button className="auth-submit" onClick={signupHandler}>Register</button>

          </div>
          <NavLink to="/login">Already registered? Login</NavLink>
        </form>
      </div>
    </div>
  );
};
export default Register;
