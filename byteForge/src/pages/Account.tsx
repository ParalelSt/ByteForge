import { useUser } from "@/components/context/UserContext";

const Account = () => {
  const { logout } = useUser();

  return (
    <div className="account-container">
      <div className="account-container-top">
        <img src="" alt="profile-picture" />
        <h2 className="name"></h2>
        <span className="email"></span>
        <button className="edit-profile-btn">EDIT PROFILE</button>
      </div>
      <div className="account-container-bottom">
        <section className="orders-section">
          <h2>ORDERS</h2>
        </section>
        <section className="account-section">
          <h2>ACCOUNT</h2>
          <button className="log-out-btn" onClick={() => logout}>
            Log Out
          </button>
        </section>
      </div>
    </div>
  );
};

export default Account;
