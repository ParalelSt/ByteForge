import { FiX } from "react-icons/fi";
import SectionContainer from "./SectionContainer";
import ProductContainer from "./ProductContainer";
import "@/styles/cart.scss";

const Cart = () => {
  return (
    <SectionContainer className="cart-section">
      <div className="cart-container-top">
        <h2>YOUR CART</h2>
        <FiX color="white" className="icon" />
      </div>
      <div className="cart-container-middle">
        <ProductContainer />
        <ProductContainer />
        <ProductContainer />
      </div>
      <div className="cart-container-bottom"></div>
    </SectionContainer>
  );
};

export default Cart;
