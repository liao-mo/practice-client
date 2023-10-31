import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Profile from "./components/Profile";
import Update from "./components/Update";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(undefined);
  const [currentPage, setCurrentPage] = useState("login");

  useEffect(function () {
    const token = Cookies.get("jwt");
    // console.log(token);

    //authorize user using jwt token stored in the cookies
    async function authenticate() {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "http://localhost:3000/users/me",
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      try {
        const res = await axios.request(config);

        //sucessfully authenticate
        if (res.status === 200) {
          setIsLogin(true);
          setUserData(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    //if user has signed in
    if (token) {
      authenticate();
    }
  }, []);

  function handleLogin(data) {
    setIsLogin(true);
    setUserData(data.user);
    Cookies.set("jwt", data.token, { expires: 7 });
  }

  function handleSignUp(data) {
    data = JSON.stringify(data);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:3000/users",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    async function requestSignUp() {
      try {
        //fire the request of sign up to the server
        const res = await axios.request(config);

        //login after sign up
        handleLogin(res.data);
      } catch (error) {
        console.log(error);
      }
    }

    requestSignUp();
  }

  function handleLogout() {
    setIsLogin(false);
    setUserData(undefined);
    Cookies.remove("jwt");
  }

  return (
    <div className="App">
      {!isLogin ? (
        <>
          <nav>
            <button
              className="btn-login-tab"
              onClick={() => setCurrentPage("login")}
            >
              Login
            </button>
            <button
              className="btn-signup-tab"
              onClick={() => setCurrentPage("signUp")}
            >
              Sign Up
            </button>
          </nav>
          {currentPage === "signUp" && <SignUp handleSignUp={handleSignUp} />}
          {currentPage === "login" && <Login onLogin={handleLogin} />}
        </>
      ) : (
        <ControlPanel userData={userData} onLogout={handleLogout} />
      )}
    </div>
  );
}

function ControlPanel({ userData, onLogout }) {
  const [functionality, setFunctionality] = useState("profile");
  return (
    <div className="controlPanel">
      <header className="control-header">
        <h2>Control Panel</h2>
        <button className="btn-logout" onClick={onLogout}>
          Logout
        </button>
      </header>
      <button onClick={() => setFunctionality("profile")}>view profile</button>
      <button onClick={() => setFunctionality("update")}>update profile</button>

      {functionality === "profile" && <Profile userData={userData} />}
      {functionality === "update" && <Update userData={userData} />}
    </div>
  );
}

export default App;
