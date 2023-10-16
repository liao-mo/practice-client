import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(undefined);

  useEffect(function () {
    const token = Cookies.get("jwt");
    async function authenticate() {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "http://localhost:3000/users/me",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTJjZWM3OGFhOTIzMWRkODQ4NzE1OWEiLCJpYXQiOjE2OTc0NDY3NTh9.eA_aQ1ZO_zRGhi5cthDnjwuljWGVa0IR8ivbF9LC2vM",
        },
      };

      try {
        const res = await axios.request(config);
        // console.log(res);

        //sucessfully authenticate
        if (res.status === 200) {
          setIsLogin(true);
          setUserData(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (token) {
      authenticate();
    }
  }, []);

  function handleLogin(data) {
    setIsLogin(true);
    setUserData(data);
  }

  function handleLogout() {
    setIsLogin(false);
    setUserData(undefined);
    Cookies.remove("jwt");
  }

  return (
    <div className="App">
      {!isLogin ? (
        <Login onLogin={handleLogin} />
      ) : (
        <ControlPanel userData={userData} onLogout={handleLogout} />
      )}
    </div>
  );
}

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFailed, setIsFailed] = useState(false);

  function handleLogin() {
    async function loginUser() {
      try {
        let data = JSON.stringify({
          email,
          password,
        });

        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "http://localhost:3000/users/login",
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        const res = await axios.request(config);

        //sucessfully login
        if (res.status === 200) {
          onLogin(res.data.user);
          // console.log(res.data);
          Cookies.set("jwt", res.data.token, { expires: 7 });
          // console.log(Cookies.get("jwt"));
        }
      } catch (error) {
        console.log(error);
        setIsFailed(true);
      }
    }

    loginUser();
  }

  return (
    <div className="login-box">
      <h1>Login</h1>
      <div className="input-grid">
        <label>Email</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password</label>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="login-hint">
          {isFailed && <p className="failed-text">Failed to login</p>}
          <button className="btn-login" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

function ControlPanel({ userData, onLogout }) {
  const [functionality, setFunctionality] = useState("profile");
  return (
    <div>
      <header className="control-header">
        <h2>Control Panel</h2>
        <button className="btn-logout" onClick={onLogout}>
          Logout
        </button>
      </header>
      <button onClick={() => setFunctionality("profile")}>view profile</button>
      <button onClick={() => setFunctionality("update")}>update profile</button>

      {functionality === "profile" && <UserProfile userData={userData} />}
      {functionality === "update" && <p>update</p>}
    </div>
  );
}

function UserProfile({ userData }) {
  return (
    <div className="user-profile">
      <p>Your Name: {userData.name}</p>
      <p>Your age: {userData.age}</p>
      <p>Your email: {userData.email}</p>
    </div>
  );
}

export default App;
