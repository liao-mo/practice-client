import { useState } from "react";
import "../App.css";

export default function UpdatePassword({ onUpdate }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <form className="user-update" onSubmit={(e) => onUpdate(e, password)}>
      <div className="row">
        <label>New password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </div>
      <div className="row">
        <label>confirm password</label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => {
            setConfirm(e.target.value);
          }}
        />
      </div>
      <button className="btn-update">Save</button>
    </form>
  );
}
