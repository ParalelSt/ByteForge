import CardContainer from "@/components/CardContainer";
import "@/styles/productCard.scss";

interface ProductCardProps {
  image: string;
  name: string;
  price: number;
}

const ProductCard = ({ image, name, price }: ProductCardProps) => {
  return (
    <CardContainer className="product-card">
      <img src={image || "/placeholder.png"} alt={name || "product image"} />
      <h3 className="name">{name || "Product name"}</h3>
      <p className="price">${price ? Number(price).toFixed(2) : "0.00"}</p>
    </CardContainer>
  );
};

export default ProductCard;
