import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import "@/styles/Header.scss";
import { Link, useLocation } from "react-router-dom";
import Cart from "@/components/Cart";
import MobileNavigation from "@/components/MobileNavigation";
import DesktopNavigation from "./DesktopNavigation";
import { BiSolidShoppingBag } from "react-icons/bi";
import { useCart } from "@/components/context/CartContext";

const Header = () => {
  const [hamburgerOpen, setHamburgerOpen] = useState<boolean>(false);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const location = useLocation();
  const { cart } = useCart();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="header-container">
      <button
        className="menu-toggle"
        onClick={() => {
          setHamburgerOpen(!hamburgerOpen);
        }}
        aria-label="Toggle navigation"
      >
        {hamburgerOpen ? (
          <FiX className="dropdown-icon" color="white" />
        ) : (
          <FiMenu className="dropdown-icon" color="white" />
        )}
      </button>
      <MobileNavigation
        isOpen={hamburgerOpen}
        setIsOpen={setHamburgerOpen}
      ></MobileNavigation>
      <DesktopNavigation></DesktopNavigation>
      <Link className="logo" to={"/"}>
        ByteForge
      </Link>
      <div className="right-actions">
        <Link
          className={`account-link ${isActive("/account") ? "active" : ""}`}
          to="/account"
        >
          <span>Account</span>
        </Link>
        <button
          className="cart-btn"
          aria-label="Go to cart"
          onClick={() => {
            setCartOpen(!cartOpen);
          }}
        >
          <BiSolidShoppingBag />
          <div className="product-count">
            <span>{cart.length}</span>
          </div>
        </button>
      </div>
      {cartOpen && <Cart cartOpen={cartOpen} setCartOpen={setCartOpen} />}
    </header>
  );
};

export default Header;
