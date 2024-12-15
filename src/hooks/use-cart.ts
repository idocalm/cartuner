import type { Product } from "@prisma/client";
import { useState } from "react";

export interface CartProduct {
  product: Product;
  amount: number;
}

const useCart = () => {
  const [content, setContent] = useState<CartProduct[]>([]);

  const save = (cart: CartProduct[]) => {
    setContent(cart);
    localStorage.setItem("cartuner_cart", JSON.stringify(cart));
  };

  const load = () => {
    const cart = localStorage.getItem("cartuner_cart");
    if (cart) {
      setContent(JSON.parse(cart));
    }
  };

  const clear = () => {
    setContent([]);
    localStorage.removeItem("cartuner_cart");
  };

  const add = (product: Product) => {
    console.log(content);
    const existingProduct = content.find((p) => p.product.id === product.id);
    if (existingProduct) {
      const updatedCart = content.map((p) =>
        p.product.id === product.id ? { ...p, amount: p.amount + 1 } : p
      );
      save(updatedCart);
      return;
    }

    const updatedCart = [...content, { product, amount: 1 }];
    save(updatedCart);
  };

  const remove = (productId: string) => {
    const existingProduct = content.find((p) => p.product.id === productId);
    if (!existingProduct) {
      return;
    }

    if (existingProduct.amount === 1) {
      const updatedCart = content.filter((p) => p.product.id !== productId);
      save(updatedCart);
      return;
    }

    const updatedCart = content.map((p) =>
      p.product.id === productId ? { ...p, amount: p.amount - 1 } : p
    );
    save(updatedCart);
  };

  return {
    content,
    add,
    remove,
    save,
    load,
    clear,
  };
};

export default useCart;
