import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      setMessage("Login successful ✅");

      // Small delay for UX so they see the success message
      setTimeout(() => {
        if (res.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      }, 800);
      
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid credentials. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Inline styles for a quick "Modern Look" upgrade
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#f4f7f9",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    card: {
      backgroundColor: "#fff",
      padding: "40px",
      borderRadius: "12px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
      width: "100%",
      maxWidth: "400px",
      textAlign: "center",
    },
    inputGroup: {
      textAlign: "left",
      marginBottom: "15px",
    },
    input: {
      width: "100%",
      padding: "12px",
      marginTop: "6px",
      borderRadius: "6px",
      border: "1px solid #ddd",
      boxSizing: "border-box",
      fontSize: "16px",
    },
    button: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background 0.3s ease",
      marginTop: "10px",
    },
    message: {
      marginTop: "15px",
      color: message.includes("✅") ? "green" : "#d9534f",
      fontSize: "14px",
      fontWeight: "500",
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={{ color: "#333", marginBottom: "8px" }}>Grievance Portal</h1>
        <p style={{ color: "#666", marginBottom: "24px" }}>Welcome back! Please login.</p>

        <form onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <label style={{ fontWeight: "600", color: "#555" }}>Email Address</label>
            <input
              style={styles.input}
              type="email"
              placeholder="name@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={{ fontWeight: "600", color: "#555" }}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            style={{...styles.button, backgroundColor: loading ? "#ccc" : "#007bff"}}
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>

        {message && <p style={styles.message}>{message}</p>}

        <p style={{ marginTop: "20px", color: "#666", fontSize: "14px" }}>
          Don’t have an account?{" "}
          <Link to="/register" style={{ color: "#007bff", textDecoration: "none", fontWeight: "600" }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;