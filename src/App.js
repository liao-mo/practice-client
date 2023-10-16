import "./App.css";
import { useState } from "react";
import axios from "axios";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(undefined);
  function handleLogin(data) {
    setIsLogin(true);
    setUserData(data);
  }
  return (
    <div className="App">
      {!isLogin ? (
        <Login onLogin={handleLogin} />
      ) : (
        <ControlPanel userData={userData} />
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
        }
      } catch (error) {
        console.log(error);
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
        <button className="btn-login" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

function ControlPanel({ userData }) {
  return (
    <div>
      <h2>Control Panel</h2>
      <UserProfile userData={userData} />
    </div>
  );
}

function UserProfile({ userData }) {
  return (
    <div>
      <p>Your Name: {userData.name}</p>
      <p>Your age: {userData.age}</p>
      <p>Your email: {userData.email}</p>
    </div>
  );
}

export default App;
