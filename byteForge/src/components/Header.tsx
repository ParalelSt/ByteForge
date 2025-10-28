import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import GIcon from "../assets/icons/GIcon.svg";

const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <header className="header-container">
        <button
          className="menu-toggle"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          aria-label="Toggle navigation"
        >
          {isOpen ? <FiX color="white" /> : <FiMenu color="white" />}
        </button>
        <nav className="nav-links">
          <a href="/shop"></a>
          <a href="/about"></a>
          <a href="/contact"></a>
        </nav>
        <div className="logo">ByteForge</div>
        <button className="cart-btn" aria-label="Go to cart">
          <img src={GIcon} alt="Cart icon" />
        </button>
      </header>
    </>
  );
};

export default Header;
