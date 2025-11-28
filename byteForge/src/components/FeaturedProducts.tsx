import ProductCard from "@/components/ProductCard";
import "@/styles/featuredProducts.scss";

const FeaturedProducts = () => {
  return (
    <div className="featured-products-container">
      <h2>FEATURED PRODUCTS</h2>

      {/* Temporary - will fix once I add the database */}

      <div className="product-cards-container">
        <ProductCard></ProductCard>
        <ProductCard></ProductCard>
        <ProductCard></ProductCard>
      </div>
    </div>
  );
};

export default FeaturedProducts;
