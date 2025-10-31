import ProductCard from "./ProductCard";
import SectionContainer from "./SectionContainer";

const FeaturedProducts = () => {
  return (
    <>
      <SectionContainer className="featured-products-container">
        <h2>FEATURED PRODUCTS</h2>
        <ProductCard></ProductCard>
      </SectionContainer>
    </>
  );
};

export default FeaturedProducts;
