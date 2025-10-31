import CardContainer from "./CardContainer";
import "@/styles/productContainer.scss";

interface ProductCardProps {
  /* For testing purposes - will remove the question marks once I implement a database*/

  image?: string;
  name?: string;
  price?: number;
}

const ProductCard = ({ image, name, price }: ProductCardProps) => {
  /* Temporary - will remove the placeholder items */

  return (
    <CardContainer className="product-card">
      <img src={image} alt="product image" />
      <h3 className="name">{name ? name : "Product name"}</h3>
      <p className="price">{price ? price : "Product price"}</p>
    </CardContainer>
  );
};

export default ProductCard;
