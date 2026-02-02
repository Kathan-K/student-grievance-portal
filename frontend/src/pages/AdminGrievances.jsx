import { useEffect, useState } from "react";
import API from "../services/api";

function AdminGrievances() {
  const [grievances, setGrievances] = useState([]);
  const [solution, setSolution] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const fetchGrievances = async () => {
    try {
      const res = await API.get("/grievance/all");
      setGrievances(res.data.grievances);
    } catch (err) {
      console.error("Failed to fetch grievances");
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const handleSubmitSolution = async (id) => {
    if (!solution) {
      alert("Please enter a solution");
      return;
    }

    try {
      await API.put(`/grievance/solution/${id}`, { solution });
      alert("Solution submitted successfully");
      setSolution("");
      setSelectedId(null);
      fetchGrievances(); // refresh list
    } catch (err) {
      alert("Failed to submit solution");
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>All Grievances</h2>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>Student</th>
            <th>Email</th>
            <th>Title</th>
            <th>Status</th>
            <th>Solution</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {grievances.map((g) => (
            <tr key={g.id}>
              <td>{g.user_name}</td>
              <td>{g.user_email}</td>
              <td>{g.title}</td>
              <td>{g.status}</td>

              <td>
                {g.solution ? (
                  g.solution
                ) : selectedId === g.id ? (
                  <textarea
                    rows="3"
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                  />
                ) : (
                  "No solution yet"
                )}
              </td>

              <td>
                {!g.solution && selectedId !== g.id && (
                  <button onClick={() => setSelectedId(g.id)}>
                    Give Solution
                  </button>
                )}

                {selectedId === g.id && (
                  <button onClick={() => handleSubmitSolution(g.id)}>
                    Submit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminGrievances;
