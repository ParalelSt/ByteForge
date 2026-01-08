import "@/styles/productContainer.scss";
import { FaEuroSign, FaMinus, FaPlus, FaTrash } from "react-icons/fa6";
import { useCart } from "@/components/context/CartContext";
import { useState, useEffect, useRef } from "react";

interface ProductContainerProps {
  image: string;
  name: string;
  alt: string;
  price: number;
  count: number;
  id: string;
}

const ProductContainer = ({
  image,
  name,
  alt,
  price,
  count,
  id,
}: ProductContainerProps) => {
  const { increase, decrease, removeItem, updateItemQuantity } = useCart();

  const [cooldown, setCooldown] = useState(false);
  const [quantity, setQuantity] = useState(count);
  const hasInitialized = useRef(false);
  const prevCountRef = useRef(count);

  // Only initialize quantity once on mount
  useEffect(() => {
    if (!hasInitialized.current) {
      setQuantity(count);
      hasInitialized.current = true;
    }
  }, []);

  // Sync quantity when count changes from button clicks (external updates)
  useEffect(() => {
    if (prevCountRef.current !== count) {
      setQuantity(count);
      prevCountRef.current = count;
    }
  }, [count]);

  const handleIncrease = () => {
    if (cooldown) {
      return;
    }
    setCooldown(true);

    increase(id);

    setTimeout(() => setCooldown(false), 150);
  };

  const handleDecrease = () => {
    if (cooldown) {
      return;
    }
    setCooldown(true);

    decrease(id);

    setTimeout(() => setCooldown(false), 150);
  };

  const handleRemove = () => {
    if (cooldown) return;
    setCooldown(true);

    removeItem(id);

    setTimeout(() => setCooldown(false), 150);
  };

  return (
    <div className="product-container">
      <div className="product-image-container">
        <img src={image} alt={alt} className="product-image" loading="lazy" />
      </div>
      <div className="cart-item-info">
        <p className="cart-name">{name}</p>

        <div className="product-count-container">
          <button
            className="product-count-down"
            onClick={handleDecrease}
            disabled={cooldown}
          >
            <FaMinus className="icon" />
          </button>

          <input
            type="number"
            className="count"
            value={quantity}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (e.target.value === "") {
                setQuantity(1);
              } else if (!isNaN(value) && value >= 1) {
                setQuantity(value);
                updateItemQuantity(id, value); // Directly update cart quantity
              }
            }}
            onBlur={(e) => {
              if (e.target.value === "") {
                setQuantity(1);
                updateItemQuantity(id, 1);
              }
            }}
            min="1"
          />

          <button
            className="product-count-up"
            onClick={handleIncrease}
            disabled={cooldown}
          >
            <FaPlus className="icon" />
          </button>

          <button
            className="product-remove-btn"
            onClick={handleRemove}
            disabled={cooldown}
          >
            <FaTrash className="icon trash-icon" />
          </button>
        </div>
      </div>
      <div className="price-container">
        <span className="product-price">
          <FaEuroSign />
          {Number(price).toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default ProductContainer;
