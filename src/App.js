import "./App.css";
import { useState } from "react";
import axios from "axios";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  return (
    <div className="App">
      {!isLogin ? <Login onLogin={setIsLogin} /> : <ControlPanel />}
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(onLogin) {
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

        axios
          .request(config)
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
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

function ControlPanel() {
  return (
    <div>
      <h2>Control Panel</h2>
    </div>
  );
}

export default App;
