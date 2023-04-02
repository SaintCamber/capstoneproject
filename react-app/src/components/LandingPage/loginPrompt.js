import "./login.css";
import { Link } from "react-router-dom";




const LoginPrompt = () => {
    return (
      <div className="login-prompt">
        <h1 className="login-prompt__title">Welcome to Songify!</h1>
        <p className="login-prompt__message">We're excited to have you here. To start using Songify, please sign in or create an account.</p>
        <div className="login-prompt__buttons">
          <Link to="/login" className="login-prompt__button login-prompt__button--login">Log In</Link>
          <Link to="/signup" className="login-prompt__button login-prompt__button--signup">Sign Up</Link>
        </div>
      </div>
    );
  };
  
  export default LoginPrompt;