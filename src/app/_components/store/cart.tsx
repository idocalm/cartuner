import React, { useEffect } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import useCart, { type CartProduct } from "~/hooks/use-cart";
import { useRouter, usePathname } from "next/navigation";

interface CartItemProps extends CartProduct {
  remove: (productId: string) => void;
  type?: "cart" | "checkout";
}

export const CartItem: React.FC<CartItemProps> = ({
  product: { name, price, description, id, image },
  amount,
  remove,
  type,
}) => {
  const total = amount * price;

  if (type === "checkout") {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-row justify-between">
            <div className="flex flex-row items-center gap-4">
              <img
                className="h-20 w-20 object-cover rounded-sm"
                src={image}
                alt="image"
              />
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold">{name}</h2>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <p className="text-lg font-semibold">${total}</p>
              <p className="text-md text-muted-foreground font-semibold">
                x{amount}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">x{amount}</p>
            <p className="text-lg font-semibold">${total}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              remove(id);
            }}
          >
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Cart: React.FC = () => {
  const cart = useCart();
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    cart.load();
  }, []);

  if (cart.content.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        No items in cart yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {cart.content.map((item) => (
        <CartItem
          key={item.product.id}
          {...item}
          remove={(productId: string) => {
            cart.remove(productId);
          }}
        />
      ))}
      <Button
        onClick={() => {
          router.push(`${pathName}/checkout`);
        }}
      >
        Checkout
      </Button>
    </div>
  );
};

export default Cart;
