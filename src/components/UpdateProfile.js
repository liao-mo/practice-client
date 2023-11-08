import { useState } from "react";
import "../App.css";

export default function Update({ userData, onUpdate }) {
  const [portrait, setPortrait] = useState(undefined);
  const [portraitURL, setPortraitURL] = useState(undefined);
  const [portraitWarning, setPortraitWarning] = useState(false);
  const [name, setName] = useState(userData.name);
  const [email, setEmail] = useState(userData.email);
  const [age, setAge] = useState(userData.age);
  const data = {
    name,
    email,
    age,
    portrait,
  };

  function handleFileChange(e) {
    const file = e.target.files[0];
    setPortrait(file);
    const imageUrl = URL.createObjectURL(file);
    setPortraitURL(imageUrl);
    setPortraitWarning(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!portrait) {
      setPortraitWarning(true);
    } else {
      onUpdate(e, data);
    }
  }

  return (
    <form className="user-update" onSubmit={handleSubmit}>
      {portrait && (
        <img className="user-portrait" src={portraitURL} alt="protrait" />
      )}
      <div className="row">
        <label>Portrait</label>
        <input type="file" onChange={handleFileChange} />
      </div>
      {portraitWarning && (
        <p className="portrait-warning">You must choose a picture file!</p>
      )}
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
