import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import GIcon from "@/assets/icons/GIcon.svg";
import "@/styles/header.scss";
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import Cart from "./Cart";

const Header = () => {
  const [hamburgerOpen, setHamburgerOpen] = useState<boolean>(false);
  const [cartOpen, setCartOpen] = useState<boolean>(false);

  return (
    <header className="header-container">
      <button
        className="menu-toggle"
        onClick={() => {
          setHamburgerOpen(!hamburgerOpen);
        }}
        aria-label="Toggle navigation"
      >
        {hamburgerOpen ? <FiX color="white" /> : <FiMenu color="white" />}
      </button>
      {hamburgerOpen && <Navigation isOpen={hamburgerOpen}></Navigation>}
      <Link className="logo" to={"/"}>
        ByteForge
      </Link>
      <button
        className="cart-btn"
        aria-label="Go to cart"
        onClick={() => {
          setCartOpen(!cartOpen);
        }}
      >
        <img src={GIcon} alt="Cart icon" />
      </button>
      {cartOpen && <Cart />}
    </header>
  );
};

export default Header;
