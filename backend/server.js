import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      setMessage("Registration successful ✅ Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: "420px", margin: "60px auto", fontFamily: "Segoe UI" }}>
      <h1>Student Grievance Portal</h1>
      <p style={{ color: "#555" }}>
        Create an account to submit and track grievances
      </p>

      <h2>Register</h2>

      <form onSubmit={handleRegister}>
        <div>
          <label>Name</label>
          <br />
          <input
            type="text"
            placeholder="Enter full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            placeholder="Enter institutional email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            placeholder="Minimum 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <br />

        {/* Account Type (Locked) */}
        <div>
          <label>Account Type</label>
          <br />
          <select value="user" disabled>
            <option>User (Student)</option>
          </select>

          <p style={{ fontSize: "13px", color: "#666", marginTop: "5px" }}>
            Admin accounts are created and managed by authorities only.
          </p>
        </div>

        <br />

        <button type="submit">Register</button>
      </form>

      {message && <p>{message}</p>}

      <p style={{ marginTop: "15px" }}>
        Already have an account?{" "}
        <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Register;
