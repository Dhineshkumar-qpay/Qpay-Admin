import React, { useState } from "react";
import "../../styles/login.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../../services/auth_service";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Email and Password are required");
      return;
    }

    try {
      setLoading(true);
      const data = {
        email: email.trim(),
        password: password.trim(),
      };

      const responseData = await login(data);

      if (responseData.status === "success") {
        localStorage.setItem("adminToken", responseData.data.token);

        toast.success(responseData.data.message || "Login Successful");
        navigate("/");
      } else {
        toast.error(responseData.message || "Invalid credentials");
      }
    } catch (error) {
      toast.error(error.message || "Login failed");      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h2>WELCOME ADMIN</h2>
          <p>Login to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
