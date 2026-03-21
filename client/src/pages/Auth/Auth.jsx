import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  loginUser,
  registerUser,
  verifyCode,
  resendCode,
} from "../../features/auth/authThunks";
import { clearError } from "../../features/auth/authSlice";
import { createProfile } from "../../features/profiles/profileThunks";
import "./Auth.css";

const getRandomAvatar = () => {
  const seed = Math.random().toString(36).substring(2, 12);
  return `https://robohash.org/${seed}?set=set4&size=100x100`;
};

export default function Auth() {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  const [mode, setMode] = useState("login");
  const [loginStep, setLoginStep] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [loginCode, setLoginCode] = useState("");
  const [loginChallengeId, setLoginChallengeId] = useState("");
  const [rememberDevice, setRememberDevice] = useState(true);
  const [alert, setAlert] = useState("");
  const [pendingProfile, setPendingProfile] = useState(false);

  const finalizeProfile = async (userPayload) => {
    if (!pendingProfile) return;
    const user = userPayload?.user;
    const userId = user?.user_id ?? user?.id;
    if (userId && fullName) {
      await dispatch(
        createProfile({
          user_id: userId,
          full_name: fullName,
          avatar_url: avatarUrl || getRandomAvatar(),
        }),
      );
    }
    setPendingProfile(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setAlert("Email and password required");
      return;
    }

    setAlert("Checking login...");
    const action = await dispatch(loginUser({ email, password }));
    if (
      action.type.endsWith("fulfilled") &&
      action.payload?.requiresTwoFactor
    ) {
      setLoginStep("2fa");
      setLoginChallengeId(action.payload.challengeId);
      const emailSent = Boolean(action.payload?.emailSent);
      setAlert(
        emailSent ? "Enter the 6-digit code" : "Code not sent. Try resend.",
      );
    }
    if (action.type.endsWith("fulfilled") && action.payload?.accessToken) {
      await finalizeProfile(action.payload);
      setAlert("");
    }
    if (action.type.endsWith("rejected")) {
      setAlert(action.payload || "Login failed");
    }
  };

  const handleVerifyLogin = async (e) => {
    e.preventDefault();

    if (!loginCode || !loginChallengeId) {
      setAlert("Login code required");
      return;
    }

    setAlert("");
    const action = await dispatch(
      verifyCode({
        purpose: "login",
        challengeId: loginChallengeId,
        code: loginCode,
        rememberDevice,
      }),
    );

    if (action.type.endsWith("fulfilled")) {
      setLoginStep("password");
      setLoginCode("");
      setLoginChallengeId("");
      await finalizeProfile(action.payload);
    }
    if (action.type.endsWith("rejected")) {
      setAlert(action.payload || "Verification failed");
    }
  };

  const handleResendLoginCode = async () => {
    if (!loginChallengeId) {
      setAlert("Login challenge missing");
      return;
    }

    setAlert("");
    const action = await dispatch(
      resendCode({ purpose: "login", challengeId: loginChallengeId }),
    );
    if (action.type.endsWith("fulfilled")) {
      if (action.payload?.challengeId) {
        setLoginChallengeId(action.payload.challengeId);
      }
      setAlert("New code sent.");
    }
    if (action.type.endsWith("rejected")) {
      setAlert(action.payload || "Resend failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !password || !passwordConfirm) {
      setAlert("All fields required");
      return;
    }

    if (password !== passwordConfirm) {
      setAlert("Passwords must match");
      return;
    }

    setAlert("Creating account...");
    const action = await dispatch(registerUser({ email, password }));
    if (
      action.type.endsWith("fulfilled") ||
      (action.payload && action.payload.emailSent)
    ) {
      setMode("verify-email");
      setPendingProfile(true);
      const emailSent = Boolean(action.payload?.emailSent);
      setAlert(
        emailSent ? "Enter the 6-digit code" : "Email not sent. Try resend.",
      );
      return;
    }
    if (action.type.endsWith("rejected")) {
      setAlert(action.payload || "Registration failed");
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();

    if (!email || !verificationCode) {
      setAlert("Email and code required");
      return;
    }

    setAlert("");
    const action = await dispatch(
      verifyCode({
        purpose: "register",
        email,
        code: verificationCode,
        rememberDevice,
      }),
    );
    if (action.type.endsWith("fulfilled")) {
      const accessToken = action.payload?.accessToken;
      if (accessToken) {
        await finalizeProfile(action.payload);
        setAlert("");
        return;
      }
      setAlert("");
      setMode("login");
      setLoginStep("password");
      setVerificationCode("");
      const loginAction = await dispatch(loginUser({ email, password }));
      if (loginAction.type.endsWith("fulfilled")) {
        if (loginAction.payload?.requiresTwoFactor) {
          setLoginStep("2fa");
          setLoginChallengeId(loginAction.payload.challengeId);
          const emailSent = Boolean(loginAction.payload?.emailSent);
          setAlert(
            emailSent ? "Enter the 6-digit code" : "Code not sent. Try resend.",
          );
        } else if (loginAction.payload?.accessToken) {
          await finalizeProfile(loginAction.payload);
        }
      }
    }
    if (action.type.endsWith("rejected")) {
      setAlert(action.payload || "Verification failed");
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setAlert("Email required to resend");
      return;
    }

    setAlert("");
    const action = await dispatch(resendCode({ purpose: "register", email }));
    if (action.type.endsWith("fulfilled")) {
      setAlert("Verification code resent.");
    }
    if (action.type.endsWith("rejected")) {
      setAlert(action.payload || "Resend failed");
    }
  };

  const subtitle =
    mode === "login"
      ? loginStep === "2fa"
        ? "Enter login code"
        : "Login to continue"
      : mode === "register"
        ? "Create an account"
        : "Verify your email";

  const handleSubmit =
    mode === "login"
      ? loginStep === "2fa"
        ? handleVerifyLogin
        : handleLogin
      : mode === "register"
        ? handleRegister
        : handleVerifyEmail;

  const renderRememberDevice = () => (
    <label className="login-checkbox">
      <input
        type="checkbox"
        checked={rememberDevice}
        onChange={(e) => setRememberDevice(e.target.checked)}
      />
      Remember this device for 30 days
    </label>
  );

  return (
    <div className="login-overlay">
      <div className="login-card">
        <h1 className="login-title">PlanYU</h1>
        <p className="login-subtitle">{subtitle}</p>

        <form className="login-form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <label>
              Full Name
              <input
                type="text"
                value={fullName}
                placeholder="John Doe"
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
              placeholder="john.doe@planyu.com"
              onChange={(e) => setEmail(e.target.value)}
              readOnly={mode === "login" && loginStep === "2fa"}
              required
            />
          </label>

          {mode !== "verify-email" && loginStep !== "2fa" && (
            <label>
              Password
              <input
                type="password"
                value={password}
                placeholder="8+ chars, upper & lower, number, symbol"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          )}

          {mode === "register" && (
            <label>
              Confirm Password
              <input
                type="password"
                value={passwordConfirm}
                placeholder="Re-enter your password"
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
              />
            </label>
          )}

          {mode === "verify-email" && (
            <label>
              Verification Code
              <input
                type="text"
                value={verificationCode}
                placeholder="Enter the 6-digit code"
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
            </label>
          )}

          {mode === "verify-email" && renderRememberDevice()}

          {mode === "login" && loginStep === "2fa" && (
            <>
              <label>
                Login Code
                <input
                  type="text"
                  value={loginCode}
                  placeholder="Enter the 6-digit code"
                  onChange={(e) => setLoginCode(e.target.value)}
                  required
                />
              </label>
              {renderRememberDevice()}
            </>
          )}

          <button
            type="submit"
            className="btn primary"
            disabled={status === "loading"}
          >
            {mode === "login"
              ? loginStep === "2fa"
                ? "Verify Login"
                : "Login"
              : mode === "register"
                ? "Register"
                : "Verify Email"}
          </button>
        </form>

        {mode === "verify-email" && (
          <div className="verify-actions">
            <button
              type="button"
              className="btn-link"
              onClick={handleResendVerification}
              disabled={status === "loading"}
            >
              Resend verification code
            </button>
          </div>
        )}

        {mode === "login" && loginStep === "2fa" && (
          <div className="verify-actions">
            <button
              type="button"
              className="btn-link"
              onClick={handleResendLoginCode}
              disabled={status === "loading"}
            >
              Resend login code
            </button>
          </div>
        )}

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
                  setLoginStep("password");
                  setAvatarUrl(getRandomAvatar());
                  setAlert("");
                  dispatch(clearError());
                }}
              >
                Register
              </button>
            </p>
          ) : mode === "register" ? (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                className="btn-link"
                onClick={() => {
                  setMode("login");
                  setLoginStep("password");
                  setAlert("");
                  dispatch(clearError());
                }}
              >
                Login
              </button>
            </p>
          ) : (
            <p>
              Already verified?{" "}
              <button
                type="button"
                className="btn-link"
                onClick={() => {
                  setMode("login");
                  setLoginStep("password");
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
