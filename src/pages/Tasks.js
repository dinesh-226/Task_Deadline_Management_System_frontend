import { useEffect, useState } from "react";
import API from "../services/api";

const Tasks = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [interns, setInterns] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [editId, setEditId] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);



    const [formData, setFormData] = useState({
        title: "",
        description: "",
        project: "",
        assignedIntern: "",
        deadline: "",
        priority: "medium",
    });

    // Fetch Tasks
    const fetchTasks = async () => {
        try {
            const { data } = await API.get("/tasks");
            setTasks(data);
        } catch (error) {
            console.error(error);
        }
    };

    // Fetch Projects
    const fetchProjects = async () => {
        try {
            const { data } = await API.get("/projects");
            setProjects(data);
        } catch (error) {
            console.error(error);
        }
    };

    // Fetch Interns
    const fetchInterns = async () => {
        try {
            const { data } = await API.get("/users/interns");
            setInterns(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTasks();

        if (user.role === "admin") {
            fetchProjects();
            fetchInterns();
        }
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Create Task
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editId) {
                await API.put(`/tasks/${editId}`, formData);
                alert("Task Updated Successfully");
                setEditId(null);
            } else {
                await API.post("/tasks", formData);
                alert("Task Created Successfully");
            }

            setFormData({
                title: "",
                description: "",
                project: "",
                assignedIntern: "",
                deadline: "",
                priority: "medium",
            });

            fetchTasks();
        } catch (error) {
            console.error(error.response?.data || error.message);
            alert("Error saving task");
        }
    };


    // Update Status (Intern)
    const updateStatus = async (id, status) => {
        try {
            await API.put(`/tasks/${id}/status`, { status });
            fetchTasks();
        } catch (error) {
            console.error(error);
        }
    };

    // DELETE TASK (Admin Only)
    const deleteTask = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this task?");
        if (!confirmDelete) return;

        try {
            await API.delete(`/tasks/${id}`);
            alert("Task Deleted Successfully");
            fetchTasks();
        } catch (error) {
            console.error(error);
            alert("Error deleting task");
        }
    };
    const handleEdit = (task) => {
        setEditId(task._id);

        setFormData({
            title: task.title,
            description: task.description,
            project: task.project?._id || task.project,
            assignedIntern: task.assignedIntern?._id || task.assignedIntern,
            deadline: task.deadline?.split("T")[0],
            priority: task.priority,
        });
    };
    const getDeadlineStatus = (task) => {
        const today = new Date();
        const deadline = new Date(task.deadline);

        // Remove time part for accurate comparison
        today.setHours(0, 0, 0, 0);
        deadline.setHours(0, 0, 0, 0);

        if (task.status === "completed") {
            return "completed";
        }

        if (deadline < today) {
            return "overdue";
        }

        if (deadline.getTime() === today.getTime()) {
            return "dueToday";
        }

        return "normal";
    };
    const handleFileUpload = async (taskId) => {
        if (!selectedFile) {
            alert("Please select a file");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            await API.post(`/tasks/${taskId}/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert("File uploaded successfully");
            fetchTasks();

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Tasks</h2>

            {/* ADMIN CREATE TASK */}
            {user.role === "admin" && (
                <div className="card p-4 mb-4 shadow">
                    <h5 className="mb-3">Create Task</h5>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            placeholder="Task Title"
                            className="form-control mb-2"
                            onChange={handleChange}
                            required
                        />

                        <textarea
                            name="description"
                            value={formData.description}
                            placeholder="Task Description"
                            className="form-control mb-2"
                            onChange={handleChange}
                            required
                        />

                        <select
                            name="project"
                            value={formData.project}
                            className="form-select mb-2"
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Project</option>
                            {projects.map((p) => (
                                <option key={p._id} value={p._id}>
                                    {p.projectName}
                                </option>
                            ))}
                        </select>

                        <select
                            name="assignedIntern"
                            value={formData.assignedIntern}
                            className="form-select mb-2"
                            onChange={handleChange}
                            required
                        >
                            <option value="">Assign Intern</option>
                            {interns.map((i) => (
                                <option key={i._id} value={i._id}>
                                    {i.name}
                                </option>
                            ))}
                        </select>

                        <select
                            name="priority"
                            value={formData.priority}
                            className="form-select mb-2"
                            onChange={handleChange}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>

                        <input
                            type="date"
                            name="deadline"
                            value={formData.deadline}
                            className="form-control mb-3"
                            onChange={handleChange}
                            required
                        />

                        <button className="btn btn-primary w-100">
                            {editId ? "Update Task" : "Create Task"}
                        </button>

                    </form>
                </div>
            )}

            {/* Search & Filter */}
            <div className="card p-3 mb-4 shadow">
                <div className="row">
                    <div className="col-md-6">
                        <input
                            type="text"
                            placeholder="Search by task title..."
                            className="form-control"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="col-md-6">
                        <select
                            className="form-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* TASK LIST */}
            <div className="row">
                {tasks
                    .filter((task) => {
                        const matchesSearch = task.title
                            ?.toLowerCase()
                            .includes(search.toLowerCase());

                        const matchesStatus =
                            statusFilter === "all" || task.status === statusFilter;

                        return matchesSearch && matchesStatus;
                    })
                    .map((task) => (
                        <div key={task._id} className="col-md-4 mb-3">
                            <div
                                className={`card p-3 shadow ${getDeadlineStatus(task) === "overdue"
                                    ? "border border-danger"
                                    : getDeadlineStatus(task) === "dueToday"
                                        ? "border border-warning"
                                        : getDeadlineStatus(task) === "completed"
                                            ? "border border-success"
                                            : ""
                                    }`}
                            >
                                <h5>{task.title}</h5>
                                <p>{task.description}</p>
                                <p><strong>Priority:</strong> {task.priority}</p>
                                <p><strong>Status:</strong> {task.status}</p>
                                {getDeadlineStatus(task) === "overdue" && (
                                    <span className="badge bg-danger mb-2">🔴 Overdue</span>
                                )}

                                {getDeadlineStatus(task) === "dueToday" && (
                                    <span className="badge bg-warning text-dark mb-2">🟡 Due Today</span>
                                )}

                                {getDeadlineStatus(task) === "completed" && (
                                    <span className="badge bg-success mb-2">🟢 Completed</span>
                                )}

                                <p>
                                    <strong>Deadline:</strong>{" "}
                                    {new Date(task.deadline).toLocaleDateString()}
                                </p>


                                {user.role === "intern" && (
                                    <>
                                        {/* Status Update */}
                                        <select
                                            className="form-select mt-2"
                                            value={task.status}
                                            onChange={(e) =>
                                                updateStatus(task._id, e.target.value)
                                            }
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                        </select>

                                        {/* FILE UPLOAD */}
                                        <input
                                            type="file"
                                            className="form-control mt-2"
                                            onChange={(e) => setSelectedFile(e.target.files[0])}
                                        />

                                        <button
                                            className="btn btn-primary btn-sm mt-2"
                                            onClick={() => handleFileUpload(task._id)}
                                        >
                                            Upload Work
                                        </button>
                                    </>
                                )}
                                {/* DELETE BUTTON and UPDATE (Admin Only) */}
                                {/* SHOW INTERN SUBMITTED FILE TO ADMIN */}
                                {user.role === "admin" &&(
                                    <>
                                        <hr />


                                        <button
                                            className="btn btn-warning btn-sm mt-2 me-2"
                                            onClick={() => handleEdit(task)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm mt-2"
                                            onClick={() => deleteTask(task._id)}
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

export default Tasks;