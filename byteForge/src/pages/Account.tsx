import { useUser } from "@/components/context/UserContext";
import { useEffect, useState } from "react";
import "@/styles/account.scss";
import AccountSettingsModal from "@/components/AccountSettingsModal";

const Account = () => {
  const { user, logout } = useUser();
  const [orders, setOrders] = useState<
    Array<{ id: number; created_at: string }>
  >([]);
  const [profilePicture, setProfilePicture] = useState<string | null>("");
  const [mode, setMode] = useState<"email" | "username" | "password" | null>(
    null
  );

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/orders/${user.id}`);
        const data = await response.json();
        setOrders(data);
        setProfilePicture(user.name[0]);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="account-container">
      <div className="account-container-top">
        <div className="profile-picture-container">
          <div className="profile-picture">
            <span>{profilePicture}</span>
          </div>
        </div>
        <h2 className="name">{user?.name}</h2>
        <span className="email">{user?.email}</span>
      </div>
      <div className="account-container-bottom">
        <section className="orders-section">
          <h2>ORDERS</h2>
          <ul className="orders-container">
            {orders
              ? orders.map((order) => (
                  <li className="order" key={order.id}>
                    <div className="order-left">
                      <span className="order-name">{`Order #${order.id}`}</span>
                      <span className="order-date">
                        {new Date(order.created_at).toLocaleDateString(
                          "en-GB",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            timeZone: "Europe/Belgrade",
                          }
                        )}
                      </span>
                    </div>
                    <div className="order-right">
                      <span className="status">Shipped</span>
                    </div>
                  </li>
                ))
              : ""}
          </ul>
        </section>
        <section className="account-section">
          <h2>ACCOUNT</h2>
          <ul className="account-settings-container">
            <li>
              <button
                className="email-change-btn"
                onClick={() => setMode("email")}
              >
                Change Email
              </button>
            </li>
            <li>
              <button
                className="name-change-btn"
                onClick={() => setMode("username")}
              >
                Change Username
              </button>
            </li>
            <li>
              <button
                className="password-change-btn"
                onClick={() => setMode("password")}
              >
                Change Password
              </button>
            </li>
            <li>
              <button className="log-out-btn" onClick={logout}>
                Log Out
              </button>
            </li>
          </ul>
        </section>
      </div>
      {mode && <AccountSettingsModal mode={mode} setMode={setMode} />}
    </div>
  );
};

export default Account;
