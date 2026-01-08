import CardContainer from "@/components/CardContainer";
import "@/styles/productCard.scss";
import { FaEuroSign } from "react-icons/fa6";

interface Discount {
  id: number;
  productId: number;
  percentage: number;
  active: boolean;
}

interface ProductCardProps {
  image: string;
  name: string;
  price: number;
  discount?: Discount | null;
  className?: string;
}

const ProductCard = ({
  image,
  name,
  price,
  discount,
  className,
}: ProductCardProps) => {
  const discountedPrice = discount
    ? (Number(price) * (1 - discount.percentage / 100)).toFixed(2)
    : null;

  return (
    <CardContainer className={`product-card ${className}`}>
      <img
        src={image || "/placeholder.png"}
        alt={name || "product image"}
        onError={(e) => {
          e.currentTarget.src = "/placeholder.png";
        }}
      />
      <h3 className="name">{name || "Product name"}</h3>
      <div className="price-container">
        <p className="price">
          <FaEuroSign />
          {discountedPrice || (price ? Number(price).toFixed(2) : "0.00")}
        </p>
        <p className={`original-price ${!discount ? "hidden" : ""}`}>
          <FaEuroSign />
          {Number(price).toFixed(2)}
        </p>
      </div>
    </CardContainer>
  );
};

export default ProductCard;
