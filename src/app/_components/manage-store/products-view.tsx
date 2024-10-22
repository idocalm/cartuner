import { Product } from "@prisma/client";
import { Store } from "lucide-react";
import React from "react";
import { Card } from "~/components/ui/card";

interface ProductCardProps {
  name: string;
  price: number;
  image: string;
  id: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  price,
  image,
  id,
}) => {
  return (
    <Card className="h-48">
      <div className="flex flex-col h-full">
        <img className="h-24 w-full object-cover" src={image} />
        <div className="flex flex-col h-full p-4">
          <div className="flex flex-row items-center justify-between">
            <a href={`/store/${id}`} className="text-lg font-bold">
              {name}
            </a>
            <div className="flex flex-row items-center gap-1">
              <span>${price}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const ProductsView: React.FC<{
  products: Product[];
}> = ({ products }) => {
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
          key={index}
          name={product.name}
          price={product.price}
          image={product.image}
          id={product.id}
        />
      ))}
    </div>
  );
};

export default ProductsView;
