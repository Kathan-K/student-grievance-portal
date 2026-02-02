import Navbar from "../components/Navbar";
import AdminGrievances from "./AdminGrievances";

function AdminDashboard() {
  return (
    <div>
      <Navbar />

      <div className="container" style={{ margin: "20px" }}>
        <AdminGrievances />
      </div>
    </div>
  );
}

export default AdminDashboard;
