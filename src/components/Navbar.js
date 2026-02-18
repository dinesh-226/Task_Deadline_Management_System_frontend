import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logoutHandler = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">

        <Link className="navbar-brand" to="/dashboard">
          Task Manager
        </Link>

        {user && (
          <div className="navbar-nav me-auto ms-4">

            <Link className="nav-link" to="/dashboard">
              Dashboard
            </Link>

            {user.role === "admin" && (
              <Link className="nav-link" to="/projects">
                Projects
              </Link>
            )}

            <Link className="nav-link" to="/tasks">
              Tasks
            </Link>

          </div>
        )}

        <div>
          {!user ? (
            <>
              <Link className="btn btn-outline-light me-2" to="/">
                Login
              </Link>
              <Link className="btn btn-outline-light" to="/register">
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="text-white me-3">
                {user.name} ({user.role})
              </span>

              <button
                className="btn btn-danger me-3"
                onClick={logoutHandler}
              >
                Logout
              </button>
              < ThemeToggle/>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
