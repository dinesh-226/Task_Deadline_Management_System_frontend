import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "intern"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const { data } = await API.post("/auth/register", formData);

    // Save user + token
    localStorage.setItem("user", JSON.stringify(data));

    alert("Registration Successful");

    navigate("/dashboard");

  } catch (error) {
    alert(error.response?.data?.message || "Registration Failed");
  }
};


  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <div className="card shadow p-4">
          <h3 className="text-center mb-4">Register</h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Role</label>
              <select
                name="role"
                className="form-select"
                onChange={handleChange}
              >
                <option value="intern">Intern</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit" className="btn btn-success w-100">
              Register
            </button>
          </form>

          <p className="text-center mt-3">
            Already have an account? <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
