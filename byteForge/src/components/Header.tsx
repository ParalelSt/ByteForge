import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import GIcon from "@/assets/icons/GIcon.svg";
import "@/styles/header.scss";
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";

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
        <Navigation isOpen={isOpen}></Navigation>
        <Link className="logo" to={"/"}>
          ByteForge
        </Link>
        <button className="cart-btn" aria-label="Go to cart">
          <img src={GIcon} alt="Cart icon" />
        </button>
      </header>
    </>
  );
};

export default Header;
