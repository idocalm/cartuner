import type { Review } from "@prisma/client";
import { Star } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";

const ReviewCard: React.FC<Review> = ({
  title,
  description,
  stars,
  createdAt,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row justify-between items-center">
          <CardTitle>{title}</CardTitle>
          <div className="flex flex-row items-center gap-2">
            <Star size={16} />
            <p>{stars}</p>
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          From {new Date(createdAt).toLocaleDateString()}
        </p>
      </CardFooter>
    </Card>
  );
};
const ReviewsView: React.FC<{
  reviews: Review[];
}> = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="w-full flex items-center justify-center">
        <p className="text-sm text-muted-foreground">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="w-full px-14">
      <Carousel>
        <CarouselContent>
          {reviews.map((review, i) => (
            <CarouselItem key={i} className="basis-1/3">
              <ReviewCard {...review} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default ReviewsView;
