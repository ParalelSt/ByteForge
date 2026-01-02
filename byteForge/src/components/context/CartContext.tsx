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
  updateItemPrice: (id: CartItem["id"], newPrice: number) => void;
}

const API_URL = "http://192.168.1.105:3000";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const STORAGE_KEY = "byteforge:cart";
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user, isReady } = useUser();

  // Load cart from database when user logs in, or from localStorage for guests
  useEffect(() => {
    // Don't load cart until UserContext is ready
    if (!isReady) {
      return;
    }

    const loadCart = async () => {
      if (user) {
        // Fetch cart from database for logged-in users
        try {
          // Fetching cart for user
          const response = await fetch(`${API_URL}/cart/${user.id}`);
          const data = await response.json();
          // Cart data from database

          // Transform database format to CartItem format
          const cartItems: CartItem[] = data.map((item: any) => ({
            id: String(item.product_id),
            name: item.name,
            image: item.image,
            price: Number(item.price),
            alt: item.name,
            quantity: item.quantity,
          }));

          // Transformed cart items
          setCart(cartItems);
          // Cart state updated

          // Merge any localStorage cart items to database
          const localCart = localStorage.getItem(STORAGE_KEY);
          if (localCart) {
            try {
              const localItems = JSON.parse(localCart);
              // Merging localStorage cart
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
              // Cart after merge
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
    if (isLoaded && !user) {
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
          const existing = prev.find((p) => String(p.id) === String(item.id));
          if (existing) {
            return prev.map((p) =>
              String(p.id) === String(item.id)
                ? { ...p, quantity: p.quantity + 1 }
                : p
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
    // CartContext increase called
    if (user) {
      const item = cart.find((i) => String(i.id) === String(id));
      // Found item
      if (!item) return;

      try {
        // Sending PATCH to update quantity
        await fetch(`${API_URL}/cart/${user.id}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: item.quantity + 1 }),
        });
        // Response status

        setCart((prev) =>
          prev.map((item) =>
            String(item.id) === String(id)
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } catch (error) {
        console.error("Failed to increase quantity:", error);
      }
    } else {
      setCart((prev) =>
        prev.map((item) =>
          String(item.id) === String(id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    }
  };

  const decrease = async (id: CartItem["id"]) => {
    // CartContext decrease called
    const item = cart.find((i) => String(i.id) === String(id));
    // Found item
    if (!item) return;

    if (user) {
      try {
        // Sending PATCH to decrease quantity
        await fetch(`${API_URL}/cart/${user.id}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: item.quantity - 1 }),
        });
        // Response status

        setCart((prev) =>
          prev
            .map((item) =>
              String(item.id) === String(id)
                ? { ...item, quantity: item.quantity - 1 }
                : item
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
            String(item.id) === String(id)
              ? { ...item, quantity: item.quantity - 1 }
              : item
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

  const updateItemPrice = (id: CartItem["id"], newPrice: number) => {
    setCart((prev) =>
      prev.map((item) =>
        String(item.id) === String(id) ? { ...item, price: newPrice } : item
      )
    );
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
        updateItemPrice,
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
