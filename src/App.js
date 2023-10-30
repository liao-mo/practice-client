import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(undefined);
  const [currentPage, setCurrentPage] = useState("login");

  useEffect(function () {
    const token = Cookies.get("jwt");
    console.log(token);

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
      {!isLogin ? (
        <>
          {currentPage === "signUp" && <SignUp handleSignUp={handleSignUp} />}
          {currentPage === "login" && <Login onLogin={handleLogin} />}
        </>
      ) : (
        <ControlPanel userData={userData} onLogout={handleLogout} />
      )}
    </div>
  );
}

function SignUp({ handleSignUp }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  function handleFormSubmit(e) {
    e.preventDefault();
    const data = {
      name,
      age,
      email,
      password,
    };
    handleSignUp(data);
  }
  return (
    <div className="signup-box">
      <h1>Sign Up</h1>
      <form className="signup-form" onSubmit={(e) => handleFormSubmit(e)}>
        <label>Your name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>Age</label>
        <input type="text" onChange={(e) => setAge(Number(e.target.value))} />
        <label>Email</label>
        <input type="text" onChange={(e) => setEmail(e.target.value)} />
        <label>password</label>
        <input type="text" onChange={(e) => setPassword(e.target.value)} />
        <button>Sign up</button>
      </form>
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
