import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

interface Product {
  id: string;
  name: string;
  image: string;
  imageUrl?: string;
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

interface ProductContextValue {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const ProductContext = createContext<ProductContextValue | null>(null);

export const ProductProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/products`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const refetch = useCallback(async () => {
    await fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading, error, refetch }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error("useProducts must be used inside ProductProvider");
  }
  return ctx;
};
