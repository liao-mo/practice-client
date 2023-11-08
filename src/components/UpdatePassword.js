import { useEffect, useState } from "react";
import "../App.css";

export default function UpdatePassword({ onUpdate }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [warning, setWarning] = useState(false);

  function handleUpdatePassword(e) {
    e.preventDefault();
    if (!warning) {
      const data = { password: password };
      onUpdate(e, data);
    }
  }

  useEffect(
    function () {
      if (password !== confirm) {
        setWarning(true);
      } else {
        setWarning(false);
      }
    },
    [password, confirm]
  );

  return (
    <form className="user-update" onSubmit={(e) => handleUpdatePassword(e)}>
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
      {warning && (
        <p className="password-warning">
          You should enter the same password above!
        </p>
      )}
      <button className="btn-update">Save</button>
    </form>
  );
}
