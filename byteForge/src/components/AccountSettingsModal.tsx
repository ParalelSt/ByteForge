import { useState } from "react";
import "@/styles/accountSettingsModal.scss";
import { FiX } from "react-icons/fi";

interface AccountSettingsModalProps {
  mode: "email" | "username" | "password" | null;
  setMode: (mode: "email" | "username" | "password" | null) => void;
}

const AccountSettingsModal = ({ mode, setMode }: AccountSettingsModalProps) => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="account-settings-modal-background">
      <div className="account-settings-modal-container">
        <h2>{mode?.toUpperCase()}</h2>

        <button className="close-btn" onClick={() => setMode(null)}>
          <FiX color="white" className="icon" />
        </button>

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
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current Password"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
            />
          </>
        )}

        <button className="submit-btn">SUBMIT</button>
      </div>
    </div>
  );
};

export default AccountSettingsModal;
