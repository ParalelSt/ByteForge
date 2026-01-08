import ProductCard from "@/components/ProductCard";
import { getImageUrl } from "@/utils/imageUrl";
import "@/styles/featuredProducts.scss";
import { useProducts } from "@/components/context/ProductContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FeaturedProducts = () => {
  const { products, loading } = useProducts();
  const [productCount, setProductCount] = useState(3);
  const featuredProducts = products
    .filter((p) => p.featured)
    .slice(0, productCount);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 500) {
        setProductCount(3);
      } else if (width < 768) {
        setProductCount(4);
      } else {
        setProductCount(6);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return (
      <div className="featured-products-container">
        <h2>FEATURED PRODUCTS</h2>
        <div className="product-cards-container">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      </div>
    );
  }

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <div className="featured-products-container">
      <h2>FEATURED PRODUCTS</h2>
      <div className="product-cards-container">
        {featuredProducts.map((product) => (
          <Link to={`/products/${product.id}`} key={product.id}>
            <ProductCard
              image={getImageUrl(product.imageUrl, product.image, "product")}
              name={product.name}
              price={product.price}
              discount={product.discount || null}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
