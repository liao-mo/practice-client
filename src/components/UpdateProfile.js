import { useState } from "react";
import "../App.css";

export default function Update({ userData, onUpdate }) {
  const [name, setName] = useState(userData.name);
  const [email, setEmail] = useState(userData.email);
  const [age, setAge] = useState(userData.age);
  const data = {
    name,
    email,
    age,
  };

  return (
    <form className="user-update" onSubmit={(e) => onUpdate(e, data)}>
      <div className="row">
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>
      <div className="row">
        <label>Email</label>
        <input
          type="text"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <div className="row">
        <label>Age</label>
        <input
          type="text"
          value={age}
          onChange={(e) => {
            setAge(e.target.value);
          }}
        />
      </div>
      <button className="btn-update">Update</button>
    </form>
  );
}
