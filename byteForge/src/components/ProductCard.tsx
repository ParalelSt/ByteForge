import CardContainer from "./CardContainer";
import "@/styles/productContainer.scss";

interface ProductCardProps {
  /* For testing purposes - will remove the question marks once I implement a database*/

  image?: string;
  name?: string;
  price?: number;
}

const ProductCard = ({ image, name, price }: ProductCardProps) => {
  return (
    <CardContainer className="product-card">
      <img src={image} alt="product image" />
      <h3 className="name">{name}</h3>
      <p className="price">{price}</p>
    </CardContainer>
  );
};

export default ProductCard;
