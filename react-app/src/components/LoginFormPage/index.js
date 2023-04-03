import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import './LoginForm.css';

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    }
  };

  const loginDemo = (e) => {
    e.preventDefault();
    dispatch(login("demo@aa.io", "password"));
    Redirect("/");
  };

    return (
      <div className="LoginForm">
        <h1 className="formTitle">Log In</h1>
        <form onSubmit={handleSubmit}>
          <ul>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
          <label className="formLabel">
            Email
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="formInput"
            />
          </label>
          <label className="formLabel">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="formInput"
            />
          </label>
          <button type="submit" className="loginButton">Log In</button>
        <button onClick={loginDemo} className="demoButton">Demo User</button>
        </form>
      </div>
    );
  }
  
export default LoginFormPage;
