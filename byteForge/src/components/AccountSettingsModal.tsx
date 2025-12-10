import { useState } from "react";
import "@/styles/accountSettingsModal.scss";
import { FiX } from "react-icons/fi";
import { useUser } from "./context/UserContext";
import { FaCheck } from "react-icons/fa6";

interface AccountSettingsModalProps {
  mode: "email" | "username" | "password" | null;
  setMode: (mode: "email" | "username" | "password" | null) => void;
}

const AccountSettingsModal = ({ mode, setMode }: AccountSettingsModalProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { user, logout } = useUser();

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const handlePasswordChange = async () => {
    if (!user?.id) {
      setMessage({ type: "error", text: "User not found" });
      return;
    }

    if (!newPassword || !currentPassword || !confirmPassword) {
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({
        type: "error",
        text: "The passwords you have entered do not match",
      });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "The password you have entered is too short, it has to be at least 8 characters",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://192.168.1.105:3000/auth/change-password",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user?.id,
            oldPassword: currentPassword,
            newPassword: newPassword,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Password changed successfully" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setMode(null), 1500);
        logout();
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to change password",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: `An error occurred ${error}` });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (mode === "password") {
      await handlePasswordChange();
    }
  };

  return (
    <div className="account-settings-modal-background">
      <div className="account-settings-modal-container">
        <h2>{mode?.toUpperCase()}</h2>

        <button className="close-btn" onClick={() => setMode(null)}>
          <FiX color="white" className="icon" />
        </button>

        {message && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        {mode === "email" && (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="New Email"
            />
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current Password"
            />
          </>
        )}

        {mode === "username" && (
          <>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="New Username"
            />
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current Password"
            />
          </>
        )}

        {mode === "password" && (
          <>
            <input
              type={showPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current Password"
            />
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
            />
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
            />

            <div className="visibility-toggle">
              <label htmlFor="visibilityBtn">
                {showPassword ? "Hide the passwords" : "Show the passwords"}
              </label>
              <button
                className="visibility-btn"
                type="button"
                id="visibilityBtn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaCheck /> : ""}
              </button>
            </div>
          </>
        )}

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "..." : "SUBMIT"}
        </button>
      </div>
    </div>
  );
};

export default AccountSettingsModal;
