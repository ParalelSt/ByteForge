import { useCart } from "@/components/context/CartContext";
import { useProducts } from "@/components/context/ProductContext";
import "@/styles/shopProducts.scss";
import "@/styles/skeletonCard.scss";

interface shopProductsProps {
  category: string | null;
  subcategory: string | null;
}

const ShopProducts = ({ category, subcategory }: shopProductsProps) => {
  const { products, loading, error } = useProducts();
  const { addItem } = useCart();

  // Filter products by category and subcategory
  const filteredProducts = products.filter((p) => {
    // If no category selected, show all
    if (!category) return true;

    // If category doesn't match, filter out
    if (p.category !== category) return false;

    // If subcategory is selected, filter by it
    if (subcategory && p.subcategory !== subcategory) return false;

    return true;
  });

  if (loading) {
    return (
      <div className="shop-products-container">
        <h2>PRODUCTS</h2>
        <div className="product-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div className="shop-product-card skeleton-card" key={i}></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-grid">
        <p>Failed to load products: {error}</p>
      </div>
    );
  }

  return (
    <div className="shop-products-container">
      <h2>PRODUCTS</h2>
      <div className="product-grid">
        {filteredProducts.map((p) => (
          <div className="shop-product-card" key={p.id}>
            <div className="product-card-top">
              <img
                src={`http://192.168.1.105:3000/images/product_images/${p.image}`}
                alt={p.name}
                className={"product-card-image"}
              />
            </div>
            <div className="product-card-bottom">
              <h3>{p.name}</h3>
              <p>{`$${p.price}`}</p>

              <button
                className="add-to-cart-btn"
                onClick={() =>
                  addItem({
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    alt: p.name,
                    image: p.image,
                  })
                }
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ShopProducts;
