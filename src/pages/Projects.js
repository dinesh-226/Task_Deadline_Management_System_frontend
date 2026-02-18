import { useEffect, useState } from "react";
import API from "../services/api";

const Projects = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [projects, setProjects] = useState([]);
  const [editId, setEditId] = useState(null); // 

  const [formData, setFormData] = useState({
    projectName: "", //
    description: ""
  });

  const fetchProjects = async () => {
    try {
      const { data } = await API.get("/projects");
      setProjects(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // CREATE + UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await API.put(`/projects/${editId}`, formData);
        alert("Project Updated Successfully");
        setEditId(null);
      } else {
        await API.post("/projects", formData);
        alert("Project Created Successfully");
      }

      setFormData({ projectName: "", description: "" });
      fetchProjects();
    } catch (error) {
      alert(error.response?.data?.message || "Error saving project");
    }
  };

  // EDIT FUNCTION
  const handleEdit = (project) => {
    setEditId(project._id);

    setFormData({
      projectName: project.projectName,
      description: project.description
    });
  };

  //  DELETE FUNCTION
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this project?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/projects/${id}`);
      alert("Project Deleted Successfully");
      fetchProjects();
    } catch (error) {
      alert("Error deleting project");
    }
  };

  return (
    <div>
      <h2 className="mb-4">Projects</h2>

      {/* Admin Create Form */}
      {user.role === "admin" && (
        <div className="card p-4 mb-4 shadow">
          <h5>{editId ? "Edit Project" : "Create Project"}</h5>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                name="projectName"
                placeholder="Project Name"
                className="form-control"
                value={formData.projectName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <textarea
                name="description"
                placeholder="Project Description"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <button className="btn btn-primary">
              {editId ? "Update Project" : "Create Project"}
            </button>
          </form>
        </div>
      )}

      {/* Project List */}
      <div className="row">
        {projects.map((project) => (
          <div key={project._id} className="col-md-4 mb-3">
            <div className="card p-3 shadow">
              <h5>{project.projectName}</h5>
              <p>{project.description}</p>

              {/*SHOW CREATED DATE */}
              <p>
                <strong>Created:</strong>{" "}
                {new Date(project.createdAt).toLocaleDateString()}
              </p>

              {/*ADMIN BUTTONS */}
              {user.role === "admin" && (
                <>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(project)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(project._id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
