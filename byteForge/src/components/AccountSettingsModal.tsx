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
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentUsername, setCurrentUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { user, logout, setUser } = useUser();

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordChange = async () => {
    if (!user?.id) {
      setMessage({ type: "error", text: "User not found" });
      return;
    }

    if (!newPassword || !currentPassword || !confirmPassword) {
      setMessage({ type: "error", text: "Please fill in all fields" });
      return;
    }

    if (currentPassword && newPassword !== confirmPassword) {
      setMessage({
        type: "error",
        text: "The passwords you have entered do not match",
      });
      return;
    }

    if (newPassword === currentPassword) {
      setMessage({
        type: "error",
        text: "The new password can not match the old password",
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
            confirmPassword: confirmPassword,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Password changed successfully" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          setMessage(null);
        }, 1000);
        setTimeout(() => {
          setMode(null);
          logout();
        }, 1500);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: `An error occurred ${error}` });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = async () => {
    if (!user?.id) {
      setMessage({ type: "error", text: "User not found" });
      return;
    }

    if (!newEmail || !currentEmail || !currentPassword) {
      setMessage({ type: "error", text: "Please fill in all fields" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail) || !emailRegex.test(currentEmail)) {
      setMessage({ type: "error", text: "Please enter a valid email address" });
      return;
    }

    if (newEmail === currentEmail) {
      setMessage({
        type: "error",
        text: "New email must be different from current email",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://192.168.1.105:3000/auth/change-email", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id,
          currentEmail: currentEmail,
          newEmail: newEmail,
          currentPassword: currentPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Email changed successfully" });
        setNewEmail("");
        setCurrentEmail("");
        setCurrentPassword("");
        setTimeout(() => {
          setMessage(null);
        }, 1000);
        setTimeout(() => {
          setMode(null);
          logout();
        }, 1500);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: `An error occurred ${error}` });
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = async () => {
    if (!user?.id) {
      setMessage({ type: "error", text: "User not found" });
      return;
    }

    if (!newUsername && !currentUsername) {
      setMessage({ type: "error", text: "Please fill in all the fields." });
      return;
    }

    if (currentPassword && newUsername === currentUsername) {
      setMessage({
        type: "error",
        text: "New username must be different from current username",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://192.168.1.105:3000/auth/change-username",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            newUsername: newUsername,
            currentUsername: currentUsername,
            currentPassword: currentPassword,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Username changed successfully" });
        setNewUsername("");
        setCurrentUsername("");
        setCurrentPassword("");
        setUser({ ...user, name: newUsername });
        setTimeout(() => {
          setMessage(null);
        }, 1000);
        setTimeout(() => {
          setMode(null);
        }, 1500);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Something went wrong. Please try again.",
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
    if (mode === "email") {
      await handleEmailChange();
    }
    if (mode === "username") {
      await handleUsernameChange();
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
              value={currentEmail}
              onChange={(e) => setCurrentEmail(e.target.value)}
              placeholder="Current Email"
            />

            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="New Email"
            />

            <input
              type={showPassword ? "text" : "password"}
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
              value={currentUsername}
              onChange={(e) => setCurrentUsername(e.target.value)}
              placeholder="Current Username"
            />
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="New Username"
            />
            <input
              type={showPassword ? "text" : "password"}
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
          </>
        )}

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
