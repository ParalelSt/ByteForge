import { FiX } from "react-icons/fi";
import SectionContainer from "@/components/SectionContainer";
import ProductContainer from "@/components/ProductContainer";
import "@/styles/cart.scss";
import { useEffect } from "react";
import { useCart } from "@/components/context/CartContext";
import { useProducts } from "@/components/context/ProductContext";

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

  const { cart, addItem } = useCart();
  const { products } = useProducts();
  const subtotal = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.id);
    if (!product) return sum;
    return sum + product.price * item.quantity;
  }, 0);

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
            {cart.map((item) => {
              const product = products.find((p) => p.id === item.id);
              if (!product) return null;

              return (
                <ProductContainer
                  key={item.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  count={item.quantity}
                  alt={item.alt}
                />
              );
            })}
          </div>
          <div className="cart-container-bottom">
            <div className="subtotal-container">
              <span className="subtotal">Subtotal:</span>
              <span className="subtotal-number">${subtotal.toFixed(2)}</span>
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
