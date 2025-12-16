import "@/styles/navigation.scss";
import { Link, useLocation } from "react-router-dom";

const DesktopNavigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="desktop-nav">
      <Link className={isActive("/shop") ? "active" : ""} to="/shop">
        <span>Shop</span>
      </Link>
      <Link className={isActive("/about") ? "active" : ""} to="/about">
        <span>About</span>
      </Link>
      <Link className={isActive("/contact") ? "active" : ""} to="/contact">
        <span>Contact</span>
      </Link>
      <Link className={isActive("/account") ? "active" : ""} to="/account">
        <span>Account</span>
      </Link>
    </nav>
  );
};

export default DesktopNavigation;
