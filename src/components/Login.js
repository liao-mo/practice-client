import "../App.css";
import { useState } from "react";
import axios from "axios";

export default function Login({ onLogin }) {
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
          onLogin(res.data);
        }
      } catch (error) {
        //console.log(error);
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
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
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
