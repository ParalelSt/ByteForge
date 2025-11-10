import { FiX } from "react-icons/fi";
import SectionContainer from "./SectionContainer";
import ProductContainer from "./ProductContainer";

const Cart = () => {
  return (
    <div className="cart">
      <SectionContainer className="cart-container">
        <div className="cart-container-top">
          <h2>YOUR CART</h2>
          <FiX color="white" className="icon" />
          <div className="cart-container-middle">
            <ProductContainer></ProductContainer>
          </div>
          <div className="cart-container-bottom"></div>
        </div>
      </SectionContainer>
    </div>
  );
};

export default Cart;
