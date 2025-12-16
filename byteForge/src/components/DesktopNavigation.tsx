import "@/styles/navigation.scss";
import { Link } from "react-router-dom";

const DesktopNavigation = () => {
  return (
    <nav className="desktop-nav">
      <Link to={"/shop"}>
        <span>Shop</span>
      </Link>
      <Link to={"/about"}>
        <span>About</span>
      </Link>
      <Link to={"/contact"}>
        <span>Contact</span>
      </Link>
      <Link to={"/account"}>
        <span>Account</span>
      </Link>
    </nav>
  );
};

export default DesktopNavigation;
