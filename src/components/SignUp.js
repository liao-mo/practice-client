import "../App.css";
import { useState } from "react";

export default function SignUp({ handleSignUp }) {
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
        <input type="email" onChange={(e) => setEmail(e.target.value)} />
        <label>password</label>
        <input type="password" onChange={(e) => setPassword(e.target.value)} />
        <button>Sign up</button>
      </form>
    </div>
  );
}
