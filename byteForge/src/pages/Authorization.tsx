import { useState, useRef } from "react";
import "@/styles/authorization.scss";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/components/context/UserContext";

const Authorization = () => {
  const loginEmailRef = useRef<HTMLInputElement>(null);
  const loginPasswordRef = useRef<HTMLInputElement>(null);

  const registerNameRef = useRef<HTMLInputElement>(null);
  const registerEmailRef = useRef<HTMLInputElement>(null);
  const registerPasswordRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState<string>("");
  const [remember, setRemember] = useState<boolean>(false);

  const { register, login, logout } = useUser();
  const navigate = useNavigate();

  const handleModeChange = (mode: "login" | "register") => {
    setMode(mode);
    setError("");
    setRemember(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const NAME = registerNameRef.current?.value.trim() || "";
    const EMAIL = registerEmailRef.current?.value.trim() || "";
    const PASSWORD = registerPasswordRef.current?.value.trim() || "";

    if (!NAME || !EMAIL || !PASSWORD) {
      setError("Please fill in all the fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(EMAIL)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const success = await register(NAME, EMAIL, PASSWORD, remember);

      if (success) {
        navigate("/");
        setError("");
        return;
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration failed";
      setError(message);
      return;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const EMAIL = loginEmailRef.current?.value.trim() || "";
    const PASSWORD = loginPasswordRef.current?.value.trim() || "";

    if (!EMAIL || !PASSWORD) {
      setError("Please fill in all the fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(EMAIL)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const success = await login(EMAIL, PASSWORD, remember);

      if (success) {
        setError("");
        navigate("/");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      setError(message);
    }
  };

  return (
    <div className="auth-container">
      <form
        className="auth-form"
        onSubmit={mode === "login" ? handleLogin : handleRegister}
      >
        {mode === "login" ? (
          <div className="auth-form-children">
            <h2>LOG IN</h2>
            <span className="subtitle">
              Welcome back! Please login to your account
            </span>
            {error && <div className="error-message">{error}</div>}
            <input ref={loginEmailRef} type="text" placeholder="Email" />
            <input
              ref={loginPasswordRef}
              type="password"
              placeholder="Password"
            />
            <div className="auth-meta">
              <label className="remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <Link to={"/"} className="forgot-password">
                Forgot password?
              </Link>
            </div>
            <button className="auth-btn">LOGIN</button>
            <span className="account-status">
              Don't have an account?
              <button
                type="button"
                onClick={() => handleModeChange("register")}
              >
                Register
              </button>
            </span>
          </div>
        ) : (
          <div className="auth-form-children">
            <h2>REGISTER</h2>
            <span className="subtitle">Create your account. It's free.</span>
            {error && <div className="error-message">{error}</div>}
            <input ref={registerNameRef} type="text" placeholder="Name" />
            <input ref={registerEmailRef} type="text" placeholder="Email" />
            <input
              ref={registerPasswordRef}
              type="password"
              placeholder="Password"
            />
            <div className="auth-meta">
              <label className="remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <span className="forgot-password" aria-hidden="true"></span>
            </div>
            <button className="auth-btn">REGISTER</button>
            <span className="account-status">
              Already have an account?
              <button type="button" onClick={() => handleModeChange("login")}>
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
