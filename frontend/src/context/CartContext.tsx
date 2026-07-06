import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authFetch } from "../utils/auth";

interface Product {
  id: number;
  [key: string]: any;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  total: number;
  addToCart: (product: number) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL as string;
  const [total, setTotal] = useState<number>(0);

  // Fetch Cart from Backend
  const fetchCart = async (): Promise<void> => {
    try {
      const res = await authFetch(`${BASEURL}/api/cart/`);
      const data = await res.json();
      setCartItems(data.items || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Add Product to Cart
  const addToCart = async (product: number): Promise<void> => {
    try {
      await authFetch(`${BASEURL}/api/cart/add/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_id: product }),
      });

      fetchCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // Remove Product from Cart
  const removeFromCart = async (itemId: number): Promise<void> => {
    try {
      await authFetch(`${BASEURL}/api/cart/remove/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item_id: itemId }),
      });

      fetchCart();
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  // Update Quantity
  const updateQuantity = async (
    itemId: number,
    quantity: number,
  ): Promise<void> => {
    if (quantity < 1) {
      await removeFromCart(itemId);
      return;
    }

    try {
      await authFetch(`${BASEURL}/api/cart/update/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item_id: itemId, quantity }),
      });

      fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const clearCart = (): void => {
    setCartItems([]);
    setTotal(0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext)!;
