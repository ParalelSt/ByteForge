import { useState } from "react";
import "@/styles/authorization.scss";
import { Link } from "react-router-dom";

const Authorization = () => {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="auth-container">
      <form className="auth-form">
        {mode === "login" ? (
          <div className="auth-form-children">
            <h2>LOG IN</h2>
            <span className="subtitle">
              Welcome back! Please login to your account
            </span>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <Link to={"/"} className="forgot-password">
              Forgot password?
            </Link>
            <button className="auth-btn">LOGIN</button>
            <span className="account-status">
              Don't have an account?
              <button
                onClick={() => {
                  setMode("register");
                }}
              >
                Register
              </button>
            </span>
          </div>
        ) : (
          <div className="auth-form-children">
            <h2>REGISTER</h2>
            <span className="subtitle">Create your account. It's free.</span>
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button className="auth-btn">REGISTER</button>
            <span className="account-status">
              Already have an account?
              <button
                onClick={() => {
                  setMode("login");
                }}
              >
                Log in
              </button>
            </span>
          </div>
        )}
      </form>
    </div>
  );
};
export default Authorization;
