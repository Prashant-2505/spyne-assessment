import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import styles from '../../../styles/Login.module.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", formData);
      navigate("/login");
    } catch (err) {
      setError("Registration failed");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.title}>Register</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
        />
        <input
          className={styles.input}
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          className={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <button  className={styles.button} type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
