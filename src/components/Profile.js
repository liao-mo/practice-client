import "../App.css";

export default function Profile({ userData }) {
  const date = new Date(userData.createdAt);
  return (
    <div className="user-profile">
      <p>Your Name: {userData.name}</p>
      <p>Your age: {userData.age}</p>
      <p>Your email: {userData.email}</p>
      <p>Created Date: {date.toLocaleString("en")}</p>
    </div>
  );
}
