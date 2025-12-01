import ProductCard from "@/components/ProductCard";
import "@/styles/featuredProducts.scss";
import { useProducts } from "@/components/context/ProductContext";
import { useEffect, useState } from "react";

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
      } else if (width < 1024) {
        setProductCount(6);
      } else {
        setProductCount(8);
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
          <ProductCard
            key={product.id}
            image={`http://192.168.1.105:3000/images/product_images/${product.image}`}
            name={product.name}
            price={product.price}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
