import { useState } from "react";
import API from "../services/api";

function RaiseGrievance() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    sub_category: "",
    type: "public",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/grievance/raise", form);
      setMessage("✅ Grievance submitted successfully");
      setForm({
        title: "",
        description: "",
        category: "",
        sub_category: "",
        type: "public",
      });
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to submit grievance");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto" }}>
      <h2>Raise Grievance</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        /><br /><br />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
        /><br /><br />

        <input
          name="sub_category"
          placeholder="Sub Category"
          value={form.sub_category}
          onChange={handleChange}
        /><br /><br />

        <select name="type" value={form.type} onChange={handleChange}>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select><br /><br />

        <button type="submit">Submit</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default RaiseGrievance;
