import Navbar from "../components/Navbar";
import RaiseGrievance from "./RaiseGrievance";
import MyGrievances from "./MyGrievances";

function UserDashboard() {
  return (
    <div>
      <Navbar />

      <div className="container" style={{ margin: "20px" }}>
        <RaiseGrievance />
        <hr style={{ margin: "20px 0" }} />
        <MyGrievances />
      </div>
    </div>
  );
}

export default UserDashboard;
