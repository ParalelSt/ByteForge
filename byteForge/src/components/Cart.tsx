import { FiX } from "react-icons/fi";
import SectionContainer from "./SectionContainer";
import ProductContainer from "./ProductContainer";
import "@/styles/cart.scss";
import { useEffect } from "react";

interface CartProps {
  cartOpen: boolean;
  setCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Cart = ({ cartOpen, setCartOpen }: CartProps) => {
  useEffect(() => {
    if (cartOpen) {
      document.body.classList.add("dropdown-open");
    } else {
      document.body.classList.remove("dropdown-open");
    }

    return () => {
      document.body.classList.remove("dropdown-open");
    };
  }, [cartOpen]);

  return (
    <div className="background-overlay" onClick={() => setCartOpen(false)}>
      <SectionContainer className="cart-section">
        <div className="cart-content" onClick={(e) => e.stopPropagation()}>
          <div className="cart-container-top">
            <h2>YOUR CART</h2>
            <button
              className="close-btn"
              onClick={() => {
                setCartOpen(false);
              }}
            >
              <FiX color="white" className="icon" />
            </button>
          </div>
          <div className="cart-container-middle">
            <ProductContainer />
            <ProductContainer />
            <ProductContainer />
            <ProductContainer />
            <ProductContainer />
            <ProductContainer />
            <ProductContainer />
            <ProductContainer />
            <ProductContainer />
            <ProductContainer />
            <ProductContainer />
          </div>
          <div className="cart-container-bottom">
            <div className="subtotal-container">
              <span className="subtotal">Subtotal:</span>
              <span className="subtotal-number">$199.98</span>
            </div>
            <div className="checkout-btn-container">
              <button className="checkout-btn">CHECKOUT</button>
            </div>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
};

export default Cart;
