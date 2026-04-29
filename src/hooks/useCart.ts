import { useState, useCallback, useEffect } from "react";
import { Product } from "../data/product-dataset";

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: { name: string; hex: string; image: string };
  selectedSize?: string;
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const loadCart = useCallback(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse cart", e);
        setItems([]);
      }
    } else {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    loadCart();
    window.addEventListener("storage", loadCart);
    window.addEventListener("cartUpdated", loadCart);
    return () => {
      window.removeEventListener("storage", loadCart);
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, [loadCart]);

  const addToCart = useCallback((product: Product, quantity: number = 1, options: { color?: any; size?: string } = {}) => {
    const saved = localStorage.getItem("cart");
    let cart: CartItem[] = saved ? JSON.parse(saved) : [];
    
    const existingIndex = cart.findIndex(item => 
      item.id === product.id && 
      item.selectedColor?.name === options.color?.name && 
      item.selectedSize === options.size
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        ...product,
        quantity,
        selectedColor: options.color,
        selectedSize: options.size
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setItems(cart);
    window.dispatchEvent(new Event("cartUpdated"));
    
    // Custom event to open drawer
    window.dispatchEvent(new CustomEvent("openCartDrawer"));
  }, []);

  const removeFromCart = useCallback((productId: string, options: { colorName?: string; size?: string } = {}) => {
    const saved = localStorage.getItem("cart");
    if (!saved) return;
    
    let cart: CartItem[] = JSON.parse(saved);
    cart = cart.filter(item => !(
      item.id === productId && 
      item.selectedColor?.name === options.colorName && 
      item.selectedSize === options.size
    ));

    localStorage.setItem("cart", JSON.stringify(cart));
    setItems(cart);
    window.dispatchEvent(new Event("cartUpdated"));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, options: { colorName?: string; size?: string } = {}) => {
    const saved = localStorage.getItem("cart");
    if (!saved) return;
    
    let cart: CartItem[] = JSON.parse(saved);
    const index = cart.findIndex(item => 
      item.id === productId && 
      item.selectedColor?.name === options.colorName && 
      item.selectedSize === options.size
    );

    if (index > -1) {
      if (quantity <= 0) {
        cart.splice(index, 1);
      } else {
        cart[index].quantity = quantity;
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      setItems(cart);
      window.dispatchEvent(new Event("cartUpdated"));
    }
  }, []);

  const clearCart = useCallback(() => {
    localStorage.removeItem("cart");
    setItems([]);
    window.dispatchEvent(new Event("cartUpdated"));
  }, []);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice
  };
}
