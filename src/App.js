import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Profile from "./components/Profile";
import UpdateProfile from "./components/UpdateProfile";
import UpdatePassword from "./components/UpdatePassword";
import Tasks from "./components/Tasks";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(undefined);
  const [userAvatar, setUserAvatar] = useState(undefined);
  const [currentPage, setCurrentPage] = useState("login");
  const [functionality, setFunctionality] = useState("profile");

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
          getUserAvatar(res.data._id);
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

  function getUserAvatar(id) {
    axios
      .get(`http://localhost:3000/users/${id}/avatar`, {
        responseType: "blob",
      })
      .then((response) => {
        const imageUrl = URL.createObjectURL(response.data);
        setUserAvatar(imageUrl);
      })
      .catch((error) => console.error("Error fetching image:", error));
  }

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
    const token = Cookies.get("jwt");
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:3000/users/logout",
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    async function requestLogout() {
      try {
        await axios.request(config);
      } catch (error) {
        console.log(error);
      }
    }

    requestLogout();

    setIsLogin(false);
    setUserData(undefined);
    Cookies.remove("jwt");
  }

  function handleUpdate(e, data) {
    e.preventDefault();

    //save portrait and remove from data object
    let formData = new FormData();
    formData.append("avatar", data.portrait);
    let hasAvatar = data.portrait ? true : false;
    delete data.portrait;

    //setup config for the update request
    let updateProfileConfig = {
      method: "patch",
      maxBodyLength: Infinity,
      url: "http://localhost:3000/users/me",
      headers: {
        Authorization: "Bearer " + Cookies.get("jwt"),
      },
      data,
    };

    //fire request for updating user profile
    async function requestUpdate() {
      try {
        const rawData = await axios.request(updateProfileConfig);

        //update the userData state
        let data = rawData.data;
        setUserData({ ...userData, ...data });
      } catch (error) {
        console.log(error);
      }
    }

    let uploadAvatarConfig = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:3000/users/me/avatar",
      headers: {
        Authorization: "Bearer " + Cookies.get("jwt"),
      },
      data: formData,
    };

    // fire request for uploading user avatar
    async function requestUploadAvatar() {
      try {
        await axios.request(uploadAvatarConfig);

        //update the userData state
        getUserAvatar(userData._id);

        //change the page back to the profile page
        setFunctionality("profile");
      } catch (error) {
        console.log(error);
      }
    }

    requestUpdate();
    if (hasAvatar) {
      requestUploadAvatar();
    }
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
        <ControlPanel onLogout={handleLogout}>
          <button className="btn-nav" onClick={() => setFunctionality("tasks")}>
            My tasks
          </button>
          <button
            className="btn-nav"
            onClick={() => setFunctionality("profile")}
          >
            view profile
          </button>
          <button
            className="btn-nav"
            onClick={() => setFunctionality("updateProfile")}
          >
            update profile
          </button>
          <button
            className="btn-nav"
            onClick={() => setFunctionality("updatePassword")}
          >
            update password
          </button>

          {functionality === "profile" && (
            <Profile userData={userData} userAvatar={userAvatar} />
          )}
          {functionality === "updateProfile" && (
            <UpdateProfile userData={userData} onUpdate={handleUpdate} />
          )}
          {functionality === "updatePassword" && (
            <UpdatePassword onUpdate={handleUpdate} />
          )}
          {functionality === "tasks" && <Tasks />}
        </ControlPanel>
      )}
    </div>
  );
}

function ControlPanel({ onLogout, children }) {
  return (
    <div className="controlPanel">
      <header className="control-header">
        <h2>Control Panel</h2>
        <button className="btn-logout" onClick={onLogout}>
          Logout
        </button>
      </header>
      {children}
    </div>
  );
}

export default App;
