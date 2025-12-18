import "@/styles/productContainer.scss";
import { FaDollarSign, FaMinus, FaPlus, FaTrash } from "react-icons/fa6";
import { useCart } from "@/components/context/CartContext";
import { useState } from "react";

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
  const { increase, decrease, removeItem } = useCart();

  const [cooldown, setCooldown] = useState(false);

  const handleIncrease = () => {
    if (cooldown) return;
    setCooldown(true);

    increase(id);

    setTimeout(() => setCooldown(false), 150);
  };

  const handleDecrease = () => {
    if (cooldown) return;
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
        <img src={image} alt={alt} className="product-image" />
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

          <span className="count">{count}</span>

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
          <FaDollarSign />
          {price}
        </span>
      </div>
    </div>
  );
};

export default ProductContainer;
