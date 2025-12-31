import ProductCard from "@/components/ProductCard";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "@/components/context/CartContext";
import "@/styles/productDetail.scss";

const ProductDetail = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [productLoading, setProductLoading] = useState(true);
  const [recommendationLoading, setRecommendationLoading] = useState(true);
  const [productError, setProductError] = useState(null);
  const [recommendationError, setRecommendationError] = useState(null);

  const [productCount, setProductCount] = useState(3);

  const { addItem } = useCart();

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
        setProductError(error.message);
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
        setRecommendationError(error.message);
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
  if (!recommendations) return <div>Recommendations not found</div>;

  const prod = Array.isArray(product) ? product[0] : product;
  const recs = Array.isArray(recommendations) ? recommendations : [];
  const imageSrc = prod.image.startsWith("http")
    ? prod.image
    : `http://192.168.1.105:3000/images/product_images/${prod.image}`;
  const visibleRecs = recs.slice(0, productCount);

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
        <p className="product-price">${prod.price}</p>
        <button
          className="add-to-cart"
          onClick={() =>
            addItem({
              id: String(prod.id),
              name: prod.name,
              price: prod.price,
              alt: prod.name,
              image: prod.image,
            })
          }
        >
          ADD TO CART
        </button>
        <div className="product-detail-desc">
          <h3>ABOUT THIS PRODUCT</h3>
          <p>{prod.description}</p>
        </div>
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
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductDetail;
