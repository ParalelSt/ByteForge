import { useCart } from "./context/CartContext";
import { useProducts } from "./context/ProductContext";
import "@/styles/shopProducts.scss";
import "@/styles/skeletonCard.scss";

const ShopProducts = () => {
  const { products, loading, error } = useProducts();
  const { addItem } = useCart();

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
        {products.map((p) => (
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
