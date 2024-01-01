import "./App.css";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useState } from "react";
import { AuthProvider, RequireAuth } from "react-auth-kit";
import Home from "./Components/Home/Home";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [userstate, setUserState] = useState({ _id: "hlk" });
  const [isLoginDisplay, setIsLoginDisplay] = useState(false);

  // const location = useLocation();
  return (
    <div>
      <AuthProvider
        authType={"cookie"}
        authName="_auth"
        cookieDomain={window.location.hostname}
        cookieSecure={false}
      >
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <RequireAuth loginPath="/login">
                  <Home />
                </RequireAuth>
              }
            ></Route>
            <Route
              path="/login"
              element={
                <Login
                  setUserState={setUserState}
                  setIsLoginDisplay={setIsLoginDisplay}
                />
              }
            ></Route>
            <Route
              path="/signup"
              element={<Register setIsLoginDisplay={setIsLoginDisplay} />}
            ></Route>
          </Routes>
        </Router>
      </AuthProvider>
      <ToastContainer />
    </div>
  );
}

export default App;
