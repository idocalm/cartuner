import type { Product } from "@prisma/client";
import { Pencil, ShoppingCart, Store } from "lucide-react";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Icons } from "~/components/ui/icons";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";

interface ProductCardProps {
  isOwner: boolean;
  requestRefresh: () => void;
  product: Product;
  addToCart?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  isOwner,
  addToCart,
  requestRefresh,
  product,
}) => {
  const { id, name, price, description, category, image } = product;

  const desc = description.length === 0 ? "No description" : description;

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>(name);
  const [editedPrice, setEditedPrice] = useState<number>(price);
  const [editedDescription, setEditedDescription] =
    useState<string>(description);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const save = api.store.updateProduct.useMutation({
    onSuccess: () => {
      setIsEditing(false);
      setIsLoading(false);
      requestRefresh();
    },
  });

  const saveProduct = () => {
    setIsLoading(true);
    save.mutate({
      id,
      name: editedName,
      price: editedPrice,
      description: editedDescription,
    });
  };

  return (
    <Card className="min-h-48 relative">
      <div className="flex flex-col h-full">
        <img className="h-24 w-full object-cover" src={image} />
        <div className="flex flex-col h-full p-4">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-3">
              {isOwner && (
                <Pencil
                  className={
                    `w-4 h-4 cursor-pointer` +
                    (isEditing ? " text-white" : " text-gray-500")
                  }
                  onClick={() => {
                    setIsEditing(!isEditing);
                  }}
                />
              )}
              <p className="text-lg font-bold">{name}</p>
            </div>
            <div className="flex flex-row items-center gap-1">
              <span>${price}</span>
            </div>
          </div>
          <p className="text-sm text-gray-500">{desc}</p>
          <div className="flex flex-row items-center justify-between mt-4 h-8 gap-2">
            <Card className="w-full text-sm h-full flex items-center justify-center ">
              {category}
            </Card>
            {addToCart && (
              <Button
                variant={"outline"}
                onClick={() => {
                  addToCart(product);
                }}
                className="h-full"
              >
                <ShoppingCart className="w-5" />
              </Button>
            )}
          </div>
          {isEditing && (
            <div className="flex flex-col gap-4 mt-4">
              <Separator />
              <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center gap-6">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    type="text"
                    id="name"
                    className="w-full"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                </div>
                <div className="flex flex-row items-center gap-6">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    type="number"
                    id="price"
                    className="w-full"
                    onChange={(e) => setEditedPrice(Number(e.target.value))}
                    value={editedPrice}
                  />
                </div>
                <div className="flex flex-row items-center gap-6">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    className="w-full"
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  disabled={isLoading}
                  className="my-2"
                  onClick={() => {
                    saveProduct();
                  }}
                >
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

const ProductsView: React.FC<{
  products: Product[];
  filter: string;
  isOwner: boolean;
  addToCart?: (product: Product) => void;
  requestRefresh: () => void;
}> = ({ products, isOwner, requestRefresh, filter, addToCart }) => {
  if (filter.length > 0) {
    products = products.filter((product) =>
      product.name.toLowerCase().includes(filter.toLowerCase())
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center gap-4 h-96">
        <Store />
        <p>No products were found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((product, index) => (
        <ProductCard
          addToCart={addToCart}
          requestRefresh={requestRefresh}
          key={index}
          product={product}
          isOwner={isOwner}
        />
      ))}
    </div>
  );
};

export default ProductsView;
