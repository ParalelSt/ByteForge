import "@/styles/productContainer.scss";

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
        <p className="cart-name">{name}</p>
        <div className="product-count-container">
          <button className="product-count-down">-</button>
          <span className="count">{count}</span>
          <button className="product-count-up">+</button>
        </div>
      </div>
      <span className="product-price">{price}</span>
    </div>
  );
};

export default ProductContainer;
