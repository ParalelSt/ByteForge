import { FiX } from "react-icons/fi";
import SectionContainer from "@/components/SectionContainer";
import ProductContainer from "@/components/ProductContainer";
import "@/styles/cart.scss";
import { useEffect, useState } from "react";
import { useCart } from "@/components/context/CartContext";
import { useProducts } from "@/components/context/ProductContext";
import { useUser } from "@/components/context/UserContext";
import { useNavigate } from "react-router-dom";

interface CartProps {
  cartOpen: boolean;
  setCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Cart = ({ cartOpen, setCartOpen }: CartProps) => {
  const navigate = useNavigate();

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

  const [checkoutMessage, setCheckoutMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const { cart, addItem, clearCart } = useCart();
  const { user } = useUser();
  const { products } = useProducts();
  const subtotal = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.id);
    if (!product) return sum;
    return sum + product.price * item.quantity;
  }, 0);

  const handleCheckout = async () => {
    if (!user) {
      setCheckoutMessage({ type: "error", text: "Please log in to checkout" });
      return;
    }

    try {
      const items = cart.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const response = await fetch("http://192.168.1.105:3000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, items }),
      });

      const data = await response.json();
      if (response.ok) {
        clearCart();
        setCheckoutMessage({
          type: "success",
          text: "Order placed successfully!",
        });
        setTimeout(() => {
          setCartOpen(false);
          setCheckoutMessage(null);
        }, 2000);
      } else {
        setCheckoutMessage({
          type: "error",
          text: data.message || "Failed to place order",
        });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setCheckoutMessage({ type: "error", text: "Error placing order" });
    }
  };

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
            {checkoutMessage && (
              <div className={`checkout-message ${checkoutMessage.type}`}>
                {checkoutMessage.text}
              </div>
            )}
            <div className="subtotal-container">
              <span className="subtotal">Subtotal:</span>
              <span className="subtotal-number">${subtotal.toFixed(2)}</span>
            </div>
            <div className="checkout-btn-container">
              <button className="checkout-btn" onClick={handleCheckout}>
                CHECKOUT
              </button>
            </div>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
};

export default Cart;
