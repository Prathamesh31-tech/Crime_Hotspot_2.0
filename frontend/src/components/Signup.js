import React, { useState } from "react";
import "./Signup.css"; // Optional if you want separate CSS

function Signup({ switchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://crime-hotspot-2-0-5.onrender.com/api/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Signup successful, please login!");
        switchToLogin();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Server not reachable!");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Sign Up</h2>
        <form onSubmit={handleSignup} className="signup-form">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="animated-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="animated-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="animated-input"
          />
          <button type="submit" className="animated-button">
            Sign Up
          </button>
        </form>
        <p className="switch-text">
          Already have an account?{" "}
          <span onClick={switchToLogin} className="switch-link">
            Login
          </span>
        </p>
      </div>
      <div className="animated-bg"></div>
    </div>
  );
}

export default Signup;
