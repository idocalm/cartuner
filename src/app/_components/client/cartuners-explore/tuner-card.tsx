import { Star } from "lucide-react";
import React from "react";
import { Card } from "~/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
interface TunerCardInterface {
  location: string;
  stars: number;
  reviewsCount: number;
  name: string;
  image: string;
  id: string;
}

const TunerCard: React.FC<TunerCardInterface> = ({
  location,
  stars,
  name,
  image,
  reviewsCount,
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
            {stars > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex flex-row items-center gap-1">
                      <Star size={16} />
                      <span>{stars}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      This rating is based on {reviewsCount}{" "}
                      {reviewsCount == 1 ? "review" : "reviews"}{" "}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="text-sm text-gray-500">{location}</div>
        </div>
      </div>
    </Card>
  );
};

export default TunerCard;
