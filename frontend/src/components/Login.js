import React, { useState } from "react";
import "./Signup.css"; // Reuse the same CSS file

function Login({ onLogin, switchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://crime-hotspot-2-0-5.onrender.com/api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        onLogin(true);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Login</h2>
        <form onSubmit={handleLogin} className="signup-form">
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
            Login
          </button>
        </form>
        <p className="switch-text">
          Don't have an account?{" "}
          <span onClick={switchToSignup} className="switch-link">
            Sign Up
          </span>
        </p>
      </div>
      <div className="animated-bg"></div>
    </div>
  );
}

export default Login;
