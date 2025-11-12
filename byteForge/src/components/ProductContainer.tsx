import "@/styles/productContainer.scss";
import { FaMinus, FaPlus } from "react-icons/fa6";

interface ProductContainerProps {
  image?: string;
  name?: string;
  alt?: string;
  price?: number;
  count?: number;
  id?: string;
}

const ProductContainer = ({
  image,
  name,
  alt,
  price,
  count,
  id,
}: ProductContainerProps) => {
  return (
    <div className="product-container">
      <div className="product-image-container">
        <img src={image} alt={alt} className="product-image" />
      </div>
      <div className="cart-item-info">
        <p className="cart-name">{name}Ball</p>
        <div className="product-count-container">
          <button className="product-count-down">
            <FaMinus className="icon" />
          </button>
          <span className="count">{count}1</span>
          <button className="product-count-up">
            <FaPlus className="icon" />
          </button>
        </div>
      </div>
      <div className="price-container">
        <span className="product-price">{price}$99.99</span>
      </div>
    </div>
  );
};

export default ProductContainer;
