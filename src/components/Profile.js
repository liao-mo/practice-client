import "../App.css";

export default function Profile({ userData, userAvatar }) {
  const date = new Date(userData.createdAt);
  return (
    <div className="user-profile">
      {userAvatar && (
        <img className="user-portrait" src={userAvatar} alt="protrait" />
      )}
      <p>Your Name: {userData.name}</p>
      <p>Your age: {userData.age}</p>
      <p>Your email: {userData.email}</p>
      <p>Created Date: {date.toLocaleString("en")}</p>
    </div>
  );
}
