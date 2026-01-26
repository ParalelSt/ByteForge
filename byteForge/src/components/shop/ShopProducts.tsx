import { useEffect } from "react";
import { useCart } from "@/components/context/CartContext";
import { useProducts } from "@/components/context/ProductContext";
import { useToast } from "@/components/context/ToastContext";
import { getImageUrl } from "@/utils/imageUrl";
import "@/styles/shop/shopProducts.scss";
import "@/styles/common/skeletonCard.scss";
import { FaCartShopping } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { BsCurrencyEuro } from "react-icons/bs";

interface shopProductsProps {
  category: string | null;
  subcategory: string | null;
}

/**
 * Product grid display component
 * Renders filtered products by category/subcategory with add-to-cart functionality
 */
const ShopProducts = ({ category, subcategory }: shopProductsProps) => {
  const { products, loading, error } = useProducts();
  const { addItem } = useCart();
  const { addToast } = useToast();

  const filteredProducts = products.filter((p) => {
    // Remove products missing images
    if (!p.image && !p.imageUrl) return false;
    if (!category) return true;
    if (p.category !== category) return false;
    if (subcategory && p.subcategory !== subcategory) return false;
    return true;
  });

  // When filtered products change (subcategory selection), ensure page scrolls to top
  useEffect(() => {
    // Only attempt when we actually have results and not loading
    if (filteredProducts.length === 0) return;
    // small delay to allow DOM to update
    const t = setTimeout(() => {
      // hard scroll for compatibility
      try {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        // forced scroll after render
      } catch (e) {
        console.warn("ShopProducts: scroll attempt failed", e);
      }
    }, 150);
    return () => clearTimeout(t);
  }, [subcategory, filteredProducts.length]);

  const handleProductClick = () => {
    // Save scroll position to sessionStorage
    sessionStorage.setItem("shopScrollPosition", window.scrollY.toString());
  };

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
          <Link
            className="shop-product-card"
            key={p.id}
            to={`/products/${p.id}`}
            onClick={handleProductClick}
          >
            <div className="product-card-top">
              <img
                src={getImageUrl(p.imageUrl, p.image, "product")}
                alt={p.name}
                className={"product-card-image"}
              />
            </div>
            <div className="product-card-bottom">
              <h3>{p.name}</h3>
              <div className="price-container">
                <p>
                  {p.discount
                    ? `${(
                        Number(p.price) *
                        (1 - p.discount.percentage / 100)
                      ).toFixed(2)}`
                    : `${Number(p.price).toFixed(2)}`}
                  <BsCurrencyEuro />
                </p>
                <p className={`original-price ${!p.discount ? "hidden" : ""}`}>
                  {`${Number(p.price).toFixed(2)}`}
                  <BsCurrencyEuro />
                </p>
              </div>

              <button
                className="add-to-cart-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addItem({
                    id: p.id,
                    name: p.name,
                    price: p.discount
                      ? Number(p.price) * (1 - p.discount.percentage / 100)
                      : p.price,
                    alt: p.name,
                    image: p.image,
                  });
                  addToast(`${p.name} added to cart!`, "success");
                }}
              >
                <div className="text-container">
                  <span>Add to Cart</span>
                </div>
                <div className="icon-container">
                  <FaCartShopping className="icon" />
                </div>
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default ShopProducts;
