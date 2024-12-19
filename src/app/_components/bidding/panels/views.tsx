import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { BiddingData } from "@prisma/client";
import BidViewChart from "../../charts/BidViewChart";

const BidViews: React.FC<BiddingData> = ({ createdAt }) => {
  const formatted = createdAt.toLocaleDateString();

  return (
    <Card className="w-2/3">
      <CardHeader>
        <CardTitle>Views</CardTitle>
        <CardDescription>
          From {formatted}, the number of views on your bid is 12.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BidViewChart createdAt={createdAt} />
      </CardContent>
    </Card>
  );
};

export default BidViews;
