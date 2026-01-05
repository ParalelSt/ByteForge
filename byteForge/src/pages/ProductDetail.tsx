import ProductCard from "@/components/ProductCard";
import ProductReviews from "@/components/ProductReviews";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "@/components/context/CartContext";
import { FaMinus, FaPlus } from "react-icons/fa6";
import "@/styles/productDetail.scss";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  alt?: string;
  description?: string;
  category: string;
  subcategory?: string;
  featured?: boolean;
  discount?: {
    id: number;
    productId: number;
    percentage: number;
    active: boolean;
  } | null;
}

const ProductDetail = () => {
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [productLoading, setProductLoading] = useState(true);
  const [recommendationLoading, setRecommendationLoading] = useState(true);
  const [productError, setProductError] = useState<string | null>(null);
  const [recommendationError, setRecommendationError] = useState<string | null>(
    null
  );

  const [quantity, setQuantity] = useState(1);
  const [cooldown, setCooldown] = useState(false);
  const [productCount, setProductCount] = useState(8);

  const { addItem } = useCart();

  const handleIncreaseQuantity = () => {
    if (cooldown) return;
    setCooldown(true);
    setQuantity((prev) => prev + 1);
    setTimeout(() => setCooldown(false), 150);
  };

  const handleDecreaseQuantity = () => {
    if (cooldown) return;
    setCooldown(true);
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    setTimeout(() => setCooldown(false), 150);
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 500) {
        setProductCount(3);
      } else if (width < 600) {
        setProductCount(4);
      } else if (width < 768) {
        setProductCount(5);
      } else if (width < 1250) {
        setProductCount(6);
      } else {
        setProductCount(8);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setProductLoading(true);
        const response = await fetch(
          `http://192.168.1.105:3000/products/${id}`
        );

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setProductError((error as Error).message);
      } finally {
        setProductLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setRecommendationLoading(true);
        const response = await fetch(
          `http://192.168.1.105:3000/products/${id}/recommendations`
        );

        if (!response.ok) {
          throw new Error("Product recommendations not found");
        }

        const data = await response.json();
        setRecommendations(data);
      } catch (error) {
        setRecommendationError((error as Error).message);
      } finally {
        setRecommendationLoading(false);
      }
    };

    fetchRecommendations();
  }, [id]);

  if (productLoading) return <div>Loading...</div>;
  if (productError) return <div>Error: {productError}</div>;
  if (!product) return <div>Product not found</div>;

  if (recommendationLoading) return <div>Loading...</div>;
  if (recommendationError) return <div>Error: {recommendationError}</div>;

  const prod = product;
  const recs = recommendations;
  const imageSrc = prod.image.startsWith("http")
    ? prod.image
    : `http://192.168.1.105:3000/images/product_images/${prod.image}`;
  const visibleRecs = recs.slice(0, productCount);

  const pricePerUnit = prod.discount
    ? Number(prod.price) * (1 - prod.discount.percentage / 100)
    : Number(prod.price);

  return (
    <div className="product-detail-container">
      <div className="product-detail-container-top">
        <div className="product-detail-image-container">
          <img
            src={imageSrc}
            alt={prod.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.png";
            }}
          />
        </div>
        <h2>{prod.name}</h2>
        <div className="price-container">
          <p className="product-price">
            {prod.discount
              ? `$${(
                  Number(prod.price) *
                  (1 - prod.discount.percentage / 100)
                ).toFixed(2)}`
              : `$${prod.price}`}
          </p>
          <p className={`original-price ${!prod.discount ? "hidden" : ""}`}>
            ${Number(prod.price).toFixed(2)}
          </p>
        </div>
        <div className="product-count">
          <button
            className="count-down"
            onClick={handleDecreaseQuantity}
            aria-label="Decrease quantity"
            disabled={cooldown}
          >
            <FaMinus className="icon" />
          </button>
          <input
            type="number"
            className="count"
            value={quantity}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (e.target.value === "" || isNaN(value)) {
                setQuantity(1);
              } else if (value >= 1) {
                setQuantity(value);
              }
            }}
            onBlur={(e) => {
              if (e.target.value === "") {
                setQuantity(1);
              }
            }}
            min="1"
          />
          <button
            className="count-up"
            onClick={handleIncreaseQuantity}
            aria-label="Increase quantity"
            disabled={cooldown}
          >
            <FaPlus className="icon" />
          </button>
        </div>
        <button
          className="add-to-cart"
          onClick={() => {
            addItem(
              {
                id: String(prod.id),
                name: prod.name,
                price: pricePerUnit,
                alt: prod.name,
                image: prod.image,
              },
              quantity
            );
            setQuantity(1);
          }}
        >
          ADD TO CART
        </button>
        <div className="product-detail-desc">
          <h3>ABOUT THIS PRODUCT</h3>
          <p>{prod.description}</p>
        </div>
        <ProductReviews productId={prod.id} />
      </div>
      <div className="product-detail-container-bottom">
        {visibleRecs.map((r) => (
          <Link
            to={`/products/${r.id}`}
            key={r.id}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ProductCard
              image={`http://192.168.1.105:3000/images/product_images/${r.image}`}
              name={r.name}
              price={r.price}
              discount={r.discount || null}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductDetail;
