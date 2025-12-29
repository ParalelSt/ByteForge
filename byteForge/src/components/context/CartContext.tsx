import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  alt: string;
  quantity: number;
}

export const CartContext = createContext<CartContextValue | null>(null);

interface CartContextValue {
  cart: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  increase: (id: CartItem["id"]) => void;
  decrease: (id: CartItem["id"]) => void;
  removeItem: (id: CartItem["id"]) => void;
  clearCart: () => void;
}

const API_URL = "http://192.168.1.105:3000";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const STORAGE_KEY = "byteforge:cart";
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user, isReady } = useUser();

  // Debug: Log cart changes
  useEffect(() => {
    console.log("🛒 Cart changed:", cart);
  }, [cart]);

  // Load cart from database when user logs in, or from localStorage for guests
  useEffect(() => {
    console.log("Cart useEffect triggered - isReady:", isReady, "user:", user);

    // Don't load cart until UserContext is ready
    if (!isReady) {
      console.log("UserContext not ready yet, waiting...");
      return;
    }

    const loadCart = async () => {
      if (user) {
        // Fetch cart from database for logged-in users
        try {
          console.log("Fetching cart for user:", user.id);
          const response = await fetch(`${API_URL}/cart/${user.id}`);
          const data = await response.json();
          console.log("Cart data from database:", data);

          // Transform database format to CartItem format
          const cartItems: CartItem[] = data.map((item: any) => ({
            id: String(item.product_id),
            name: item.name,
            image: item.image,
            price: Number(item.price),
            alt: item.name,
            quantity: item.quantity,
          }));

          console.log("Transformed cart items:", cartItems);
          setCart(cartItems);
          console.log("Cart state updated with:", cartItems);

          // Merge any localStorage cart items to database
          const localCart = localStorage.getItem(STORAGE_KEY);
          if (localCart) {
            try {
              const localItems = JSON.parse(localCart);
              console.log("Merging localStorage cart:", localItems);
              for (const item of localItems) {
                await fetch(`${API_URL}/cart`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    userId: user.id,
                    productId: item.id,
                    quantity: item.quantity,
                  }),
                });
              }
              localStorage.removeItem(STORAGE_KEY);
              // Reload cart after merge
              const updatedResponse = await fetch(`${API_URL}/cart/${user.id}`);
              const updatedData = await updatedResponse.json();
              const updatedCart: CartItem[] = updatedData.map((item: any) => ({
                id: String(item.product_id),
                name: item.name,
                image: item.image,
                price: Number(item.price),
                alt: item.name,
                quantity: item.quantity,
              }));
              setCart(updatedCart);
              console.log("Cart after merge:", updatedCart);
            } catch (error) {
              console.error("Failed to merge localStorage cart:", error);
            }
          }
        } catch (error) {
          console.error("Failed to load cart from database:", error);
        }
      } else {
        // Load from localStorage for guests
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            setCart(JSON.parse(stored));
          } catch {
            localStorage.removeItem(STORAGE_KEY);
          }
        } else {
          setCart([]);
        }
      }
      setIsLoaded(true);
    };

    setIsLoaded(false);
    loadCart();
  }, [user, isReady]);

  // Save to localStorage for guests only
  useEffect(() => {
    console.log(
      "💾 localStorage effect - isLoaded:",
      isLoaded,
      "user:",
      user,
      "cart:",
      cart
    );
    if (isLoaded && !user) {
      console.log("💾 Saving guest cart to localStorage:", cart);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, isLoaded, user]);

  const addItem = async (item: Omit<CartItem, "quantity">) => {
    if (user) {
      // Add to database
      try {
        await fetch(`${API_URL}/cart`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            productId: item.id,
            quantity: 1,
          }),
        });

        // Update local state
        setCart((prev) => {
          const existing = prev.find((p) => p.id === item.id);
          if (existing) {
            return prev.map((p) =>
              p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
            );
          }
          return [...prev, { ...item, quantity: 1 }];
        });
      } catch (error) {
        console.error("Failed to add item to cart:", error);
      }
    } else {
      // Add to localStorage for guests
      setCart((prev) => {
        const existing = prev.find((p) => p.id === item.id);
        if (existing) {
          return prev.map((p) =>
            p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
          );
        }
        return [...prev, { ...item, quantity: 1 }];
      });
    }
  };

  const increase = async (id: CartItem["id"]) => {
    if (user) {
      const item = cart.find((i) => i.id === id);
      if (!item) return;

      try {
        await fetch(`${API_URL}/cart/${user.id}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: item.quantity + 1 }),
        });

        setCart((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      } catch (error) {
        console.error("Failed to increase quantity:", error);
      }
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    }
  };

  const decrease = async (id: CartItem["id"]) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    if (user) {
      try {
        await fetch(`${API_URL}/cart/${user.id}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: item.quantity - 1 }),
        });

        setCart((prev) =>
          prev
            .map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item
            )
            .filter((item) => item.quantity > 0)
        );
      } catch (error) {
        console.error("Failed to decrease quantity:", error);
      }
    } else {
      setCart((prev) =>
        prev
          .map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item
          )
          .filter((item) => item.quantity > 0)
      );
    }
  };

  const removeItem = async (id: CartItem["id"]) => {
    if (user) {
      try {
        await fetch(`${API_URL}/cart/${user.id}/${id}`, {
          method: "DELETE",
        });

        setCart((prev) => prev.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Failed to remove item:", error);
      }
    } else {
      setCart((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await fetch(`${API_URL}/cart/clear/${user.id}`, {
          method: "DELETE",
        });

        setCart([]);
      } catch (error) {
        console.error("Failed to clear cart:", error);
      }
    } else {
      setCart([]);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        increase,
        decrease,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be inside a CartProvider");
  }

  return context;
};
