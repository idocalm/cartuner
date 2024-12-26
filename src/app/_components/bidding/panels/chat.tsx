import { Bidding, BiddingData, BiddingStatus } from "@prisma/client";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { Separator } from "~/components/ui/separator";

const ChatPreview: React.FC<{ bid: Bidding }> = ({ bid }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex justify-between">
        <div className="flex flex-row gap-2">
          <Badge variant="outline">
            <div className="min-w-10 flex items-center justify-center">
              <p className="font-bold text-md">
                {bid.isFlexible ? "Flexible" : "Fixed"}
              </p>
            </div>
          </Badge>

          <p className="text-greenish font-semibold">${bid.price}</p>
          <p className="font-semibold"> - {bid.storeId}</p>
        </div>

        <div className="text-sm text-gray-500">
          {new Date(bid.createdAt).toLocaleTimeString()}
        </div>
      </div>
      <div>Hello</div>
      <Separator />
    </div>
  );
};

const BidChat: React.FC<{
  data: BiddingData;
  bids: Bidding[];
}> = ({ data, bids }) => {
  const [selectedBid, setSelectedBid] = useState<Bidding | null>(null);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Chat</CardTitle>
        <CardDescription>
          Chat with the tuners in real-time. Ask questions, bargain and more
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full h-full rounded-lg border"
        >
          <ResizablePanel defaultSize={35}>
            <div className="flex h-full flex-col items-center justify-center px-3 py-4 gap-4">
              {
                // render the chat messages
                bids.map((bid, index) => (
                  <ChatPreview key={index} bid={bid} />
                ))
              }
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={65}>
            {selectedBid ? (
              <div>Check</div>
            ) : (
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">
                  Select a bid to view the chat
                </span>
              </div>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </CardContent>{" "}
    </Card>
  );
};

export default BidChat;
