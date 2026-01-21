import CardContainer from "@/components/common/CardContainer";
import "@/styles/product/productCard.scss";
import { BsCurrencyEuro } from "react-icons/bs";

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

/**
 * Product card component for displaying products in grid layouts
 * Shows product image, name, price, and applies discount badge if applicable
 */

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
          {discountedPrice || (price ? Number(price).toFixed(2) : "0.00")}
          <BsCurrencyEuro />
        </p>
        <p className={`original-price ${!discount ? "hidden" : ""}`}>
          {Number(price).toFixed(2)}
          <BsCurrencyEuro />
        </p>
      </div>
    </CardContainer>
  );
};

export default ProductCard;
