import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const itemsFromStorage = await AsyncStorage.getItem('cart');
      if (itemsFromStorage) {
        setProducts(JSON.parse(itemsFromStorage));
      }
    }
    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      const productIndex = products.findIndex(p => p.id === product.id);

      if (productIndex >= 0) {
        const updatedCart = [...products];
        updatedCart[productIndex].quantity += 1;
        setProducts(updatedCart);
        await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
      } else {
        const newCart = [...products, { ...product, quantity: 1 }];
        setProducts(newCart);
        await AsyncStorage.setItem('cart', JSON.stringify(newCart));
      }
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const productIndex = products.findIndex(p => p.id === id);

      if (productIndex >= 0) {
        const updatedCart = [...products];
        updatedCart[productIndex].quantity += 1;
        setProducts(updatedCart);
        await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
      }
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const productIndex = products.findIndex(p => p.id === id);
      if (productIndex >= 0) {
        const updatedCart = [...products];
        updatedCart[productIndex].quantity -= 1;
        if (updatedCart[productIndex].quantity === 0) {
          updatedCart.splice(productIndex, 1);
        }
        setProducts(updatedCart);
        await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
      }
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
