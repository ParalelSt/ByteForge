import "@/styles/product/productContainer.scss";
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

  const handleRemove = async () => {
    if (cooldown) return;
    setCooldown(true);

    await removeItem(id);

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
            type="text"
            inputMode="numeric"
            className="count"
            value={quantity}
            onKeyDown={(e) => {
              // Block non-numeric keys (except Backspace, Delete, Tab, Enter)
              if (
                !/[0-9]/.test(e.key) &&
                ![
                  "Backspace",
                  "Delete",
                  "Tab",
                  "Enter",
                  "ArrowLeft",
                  "ArrowRight",
                ].includes(e.key)
              ) {
                e.preventDefault();
              }
            }}
            onPaste={(e) => {
              // Block pasting non-numeric content
              const pastedText = e.clipboardData.getData("text");
              if (!/^\d+$/.test(pastedText)) {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              const input = e.target.value;
              // Only process if input contains only digits
              if (input === "") {
                setQuantity(1); // Reset to 1 instead of 0
              } else if (/^\d+$/.test(input)) {
                const value = parseInt(input, 10);
                if (value >= 1) {
                  setQuantity(value);
                  updateItemQuantity(id, value);
                } else {
                  setQuantity(1); // Don't allow 0
                  updateItemQuantity(id, 1);
                }
              }
              // If input contains invalid characters, don't update state
            }}
            onBlur={(e) => {
              if (quantity < 1 || quantity === 0 || e.target.value === "") {
                setQuantity(1);
                updateItemQuantity(id, 1);
              }
            }}
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
