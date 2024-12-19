import { Bidding, BiddingData, BiddingStatus } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

const BidChat: React.FC<{
  data: BiddingData;
}> = ({ data }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Chat</CardTitle>
        <CardDescription>
          Chat with the tuners in real-time. Ask questions, bargain and more
        </CardDescription>
      </CardHeader>
      <CardContent>{}</CardContent>
    </Card>
  );
};

export default BidChat;
