import { useEffect, useState } from "react";
import API from "../services/api";

function MyGrievances() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        const res = await API.get("/grievance/my");
        setGrievances(res.data.grievances);
      } catch (err) {
        console.error("Failed to fetch grievances");
      } finally {
        setLoading(false);
      }
    };

    fetchGrievances();
  }, []);

  if (loading) {
    return <p>Loading grievances...</p>;
  }

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>My Grievances</h2>

      {grievances.length === 0 ? (
        <p>No grievances found.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Solution</th>
              <th>Closed</th>
            </tr>
          </thead>

          <tbody>
            {grievances.map((g) => (
              <tr key={g.id}>
                <td>{g.title}</td>
                <td>{g.category || "-"}</td>
                <td>{g.status}</td>
                <td>{g.solution || "Not yet provided"}</td>
                <td>{g.is_closed ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyGrievances;
