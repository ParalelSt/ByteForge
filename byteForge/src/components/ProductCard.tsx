import CardContainer from "@/components/CardContainer";
import "@/styles/productCard.scss";

interface ProductCardProps {
  image: string;
  name: string;
  price: number;
  className?: string;
}

const ProductCard = ({ image, name, price, className }: ProductCardProps) => {
  return (
    <CardContainer className={`product-card ${className}`}>
      <img
        src={image || "/placeholder.png"}
        alt={name || "product image"}
        onError={(e) => {
          console.error("Failed to load image:", image);
          e.currentTarget.src = "/placeholder.png";
        }}
        onLoad={() => console.log("Image loaded:", image)}
      />
      <h3 className="name">{name || "Product name"}</h3>
      <p className="price">${price ? Number(price).toFixed(2) : "0.00"}</p>
    </CardContainer>
  );
};

export default ProductCard;
