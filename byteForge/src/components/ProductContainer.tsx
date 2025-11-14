import "@/styles/productContainer.scss";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa6";
import { useCart } from "./context/CartContext";

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

  return (
    <div className="product-container">
      <div className="product-image-container">
        <img src={image} alt={alt} className="product-image" />
      </div>
      <div className="cart-item-info">
        <p className="cart-name">{name}Ball</p>
        <div className="product-count-container">
          <button className="product-count-down" onClick={() => decrease(id)}>
            <FaMinus className="icon" />
          </button>
          <span className="count">{count}</span>
          <button className="product-count-up" onClick={() => increase(id)}>
            <FaPlus className="icon" />
          </button>
          <button className="product-count-up" onClick={() => removeItem(id)}>
            <FaTrash className={"icon trash-icon"} />
          </button>
        </div>
      </div>
      <div className="price-container">
        <span className="product-price">{price}</span>
      </div>
    </div>
  );
};

export default ProductContainer;
