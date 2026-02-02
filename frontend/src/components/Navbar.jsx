import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div
      style={{
        padding: "15px 30px",
        backgroundColor: "#1976d2",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2>Student Grievance Portal</h2>

      <div>
        <span style={{ marginRight: "20px" }}>
          {role === "admin" ? "Admin Dashboard" : "User Dashboard"}
        </span>

        <button
          onClick={handleLogout}
          style={{
            padding: "6px 12px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
