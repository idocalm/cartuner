import { Star } from "lucide-react";
import React from "react";
import { Card } from "~/components/ui/card";

interface TunerCardInterface {
  location: string;
  stars: number;
  name: string;
  image: string;
  id: string;
}

const TunerCard: React.FC<TunerCardInterface> = ({
  location,
  stars,
  name,
  image,
  id,
}) => {
  return (
    <Card className="h-48">
      <div className="flex flex-col h-full">
        <img className="h-24 w-full object-cover" src={image} alt="image" />
        <div className="flex flex-col h-full p-4">
          <div className="flex flex-row items-center justify-between">
            <a href={`/store/${id}`} className="text-lg font-bold">
              {name}
            </a>
            <div className="flex flex-row items-center gap-1">
              <Star size={16} />
              <span>{stars}</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">{location}</div>
        </div>
      </div>
    </Card>
  );
};

export default TunerCard;
