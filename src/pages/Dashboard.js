import { useEffect, useState } from "react";
import API from "../services/api";

const Dashboard = () => {
  const [data, setData] = useState(null);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard");
      setData(res.data);
    } catch (error) {
      console.error("Dashboard Error:", error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (!data) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">

      {/* ================= ADMIN DASHBOARD ================= */}
      {data.role === "admin" && (
        <>
          <div className="row mb-4">
            <StatCard title="Total Projects" value={data.stats?.totalProjects || 0} />
            <StatCard title="Total Tasks" value={data.stats?.totalTasks || 0} />

            {/*NOW SHOW ACTIVE INTERNS COUNT */}
            <StatCard
              title="Total Interns"
              value={data.activeInterns?.length || 0}
            />

            <StatCard title="Completed Tasks" value={data.stats?.completedTasks || 0} />
            <StatCard title="Pending Tasks" value={data.stats?.pendingTasks || 0} />
            <StatCard title="In Progress" value={data.stats?.inProgressTasks || 0} />
          </div>

          <div className="row">

            {/* INTERN SUBMISSIONS */}
            <div className="col-md-6">
              <div className="card p-3 shadow mb-4">
                <h5>Intern Submissions</h5>

                {!data.submittedTasks?.length && (
                  <p>No files uploaded yet</p>
                )}

                {data.submittedTasks?.map((task) => (
                  <div key={task._id} className="border-bottom py-2">
                    <strong>{task.title}</strong>

                    <div>
                      <strong>Intern:</strong> {task.assignedIntern?.name}
                    </div>

                    <a
                      href={`http://localhost:8080/uploads/${task.submittedFile?.filePath}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-success btn-sm mt-2"
                    >
                      View File
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* RECENT TASKS */}
            <div className="col-md-6">
              <div className="card p-3 shadow mb-4">
                <h5>Recent Tasks</h5>

                {data.recentTasks?.map((task) => (
                  <div key={task._id} className="border-bottom py-2">
                    <strong>{task.title}</strong>
                    <div>
                      {task.assignedIntern?.name} | {task.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RECENT PROJECTS */}
            <div className="col-md-6">
              <div className="card p-3 shadow mb-4">
                <h5>Recent Projects</h5>

                {data.recentProjects?.map((project) => (
                  <div key={project._id} className="border-bottom py-2">
                    {project.projectName}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </>
      )}

      {/* ================= INTERN DASHBOARD ================= */}
      {data.role === "intern" && (
        <div className="row mb-4">
          <StatCard title="My Tasks" value={data.stats?.myTasks || 0} />
          <StatCard title="Completed" value={data.stats?.completed || 0} />
          <StatCard title="Pending" value={data.stats?.pending || 0} />
          <StatCard title="In Progress" value={data.stats?.inProgress || 0} />
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="col-md-3 mb-3">
    <div className="card shadow text-center p-3">
      <h6>{title}</h6>
      <h3>{value}</h3>
    </div>
  </div>
);

export default Dashboard;