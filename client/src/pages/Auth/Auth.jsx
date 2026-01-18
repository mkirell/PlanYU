import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginUser, registerUser } from "../../features/auth/authThunks";
import { clearError } from "../../features/auth/authSlice";
import { createProfile } from "../../features/profiles/profileThunks";
import "./Auth.css";

const getRandomAvatar = () => {
  const seed = Math.random().toString(36).substring(2, 12);
  return `https://robohash.org/${seed}?set=set4&size=100x100`;
};

export default function Auth({ onLogin }) {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.auth);

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [alert, setAlert] = useState("");

  useEffect(() => {
    if (data?.user_id) {
      localStorage.setItem("currentUserId", data.user_id);
      onLogin(data.user_id);
    }
  }, [data, onLogin]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setAlert("Email and password are required");
      return;
    }

    setAlert("");
    await dispatch(loginUser({ email: email, password: password }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !password || !passwordConfirm) {
      setAlert("All fields are required");
      return;
    }

    if (password !== passwordConfirm) {
      setAlert("Passwords must match");
      return;
    }

    setAlert("");
    const action = await dispatch(
      registerUser({
        email: email,
        password: password,
      })
    );
    if (action.type.endsWith("fulfilled")) {
      const userData = action.payload;
      await dispatch(
        createProfile({
          user_id: userData.user_id,
          full_name: fullName,
          avatar_url: avatarUrl,
        })
      );
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-card">
        <h1 className="login-title">PlanYU</h1>
        <p className="login-subtitle">
          {mode === "login" ? "Login to continue" : "Register a new account"}
        </p>

        <form
          className="login-form"
          onSubmit={mode === "login" ? handleLogin : handleRegister}
        >
          {mode === "register" && (
            <label>
              Full Name
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {mode === "register" && (
            <label>
              Confirm Password
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
              />
            </label>
          )}

          <button
            type="submit"
            className="btn primary"
            disabled={status === "loading"}
          >
            {mode === "login" ? "Login" : "Register"}
          </button>
        </form>

        {(alert || error) && (
          <div className={alert ? "login-warning" : "login-error"}>
            {alert || error}
          </div>
        )}

        <div className="auth-switch">
          {mode === "login" ? (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                className="btn-link"
                onClick={() => {
                  setMode("register");
                  setAvatarUrl(getRandomAvatar());
                  setAlert("");
                  dispatch(clearError());
                }}
              >
                Register
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                className="btn-link"
                onClick={() => {
                  setMode("login");
                  setAlert("");
                  dispatch(clearError());
                }}
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
