import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { BiddingData, Bidding } from "@prisma/client";
import { LockClosedIcon, TrashIcon } from "@radix-ui/react-icons";
import { Separator } from "~/components/ui/separator";
import { Input } from "~/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Badge } from "~/components/ui/badge";

const LeadingBid: React.FC<{ bid: Bidding }> = ({ bid }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-4">
              <Badge variant="outline">
                <div className="min-w-10 flex items-center justify-center">
                  <p className="font-bold text-md">
                    {bid.isFlexible ? "Flexible" : "Fixed"}
                  </p>
                </div>
              </Badge>
              <p>
                <span className="text-3xl font-black tracking-tight text-greenish ">
                  LEADING{" "}
                </span>
                BID
              </p>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <p className="text-2xl font-semibold">${bid.price}</p>
              <Button variant="default" className="flex flex-row gap-3">
                <LockClosedIcon />
                Secure Deal
              </Button>
              <Button variant="destructive" className="flex flex-row gap-3">
                <TrashIcon />
                Decline
              </Button>
            </div>
          </div>
        </CardTitle>
        <CardDescription>
          {bid.storeId} has submitted the leading bid of ${bid.price}.
        </CardDescription>
        <CardContent>
          <div className="flex flex-col justify-center py-4 gap-4">
            <Input placeholder="Enter a counter offer" type="number" />
            <TooltipProvider>
              <Tooltip>
                <TooltipContent>
                  {bid.isFlexible ? (
                    <p>
                      You can submit a counter offer to the tuner. Once the
                      tuner accepts, you&apos;ll be able to secure the deal.
                    </p>
                  ) : (
                    <p>
                      This bid is{" "}
                      <span className="text-red-500 font-bold">NOT</span>{" "}
                      flexible. You can either accept or decline the full offer.
                    </p>
                  )}
                </TooltipContent>
                <TooltipTrigger>
                  <Button
                    variant="secondary"
                    disabled={!bid.isFlexible}
                    className="w-full"
                  >
                    Submit
                  </Button>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </CardHeader>
    </Card>
  );
};

const Bid: React.FC<{ bid: Bidding }> = ({ bid }) => {
  return (
    <div className="flex flex-row gap-4 w-full rounded-md p-2 border">
      <div className="flex flex-col gap-2">
        <span className="text-lg font-semibold">{bid.storeId}</span>
        <span className="text-sm font-semibold">{bid.price}</span>
      </div>
      <Button variant="secondary">View</Button>
    </div>
  );
};

const BidOffers: React.FC<{
  data: BiddingData;
  bids: Bidding[];
}> = ({ data, bids }) => {
  if (!bids.length || !bids[0]) {
    return (
      <Card className="w-2/3">
        <CardHeader>
          <CardTitle>Offers</CardTitle>
          <CardDescription>
            No offers have been submitted yet. Check back later.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const leadingBid = bids.sort((a, b) => a.price - b.price)[0];

  if (!leadingBid) {
    return (
      <Card className="w-2/3">
        <CardHeader>
          <CardTitle>Offers</CardTitle>
          <CardDescription>
            No offers have been submitted yet. Check back later.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  bids = bids.filter((bid) => bid.id !== leadingBid.id);

  return (
    <Card className="w-2/3">
      <CardHeader>
        <CardTitle>Offers</CardTitle>
        <CardDescription>
          View the offers that tuners have submitted.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 max-h-[500px] overflow-auto">
          <div className="flex flex-col gap-3">
            <LeadingBid bid={leadingBid} />
            <Separator />
          </div>

          {bids.map((bid) => (
            <Bid key={bid.id} bid={bid} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BidOffers;
