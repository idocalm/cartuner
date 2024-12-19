"use client";

import { toast } from "sonner";
import InitiateBidButton from "./initiate-button";
import { useState } from "react";
import { Bidding, BiddingData, BiddingStatus } from "@prisma/client";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";
import ErrorPanel from "../client/shared/error";
import HelpTooltip from "./help-tooltip";
import BidStatus from "./bid-status";
import BidChat from "./panels/chat";
import BidViews from "./panels/views";
import BidOffers from "./panels/offers";

interface BiddingProps {
  data?: BiddingData;
  status: BiddingStatus;
  bids?: Bidding[];
}

const BidData: React.FC<{ data?: BiddingData; bids?: Bidding[] }> = ({
  data,
  bids,
}) => {
  if (!data) {
    return <ErrorPanel message="Failed to fetch bid data" />;
  }

  return (
    // create a 2x2 grid with cards, empty for now. make the first col bigger
    <div className="flex flex-col gap-4 w-full justify-center">
      <div className="flex flex-row gap-4 w-full">
        <BidOffers bids={bids || []} data={data} />
        <BidViews {...data} />
      </div>
      <BidChat data={data} />
    </div>
  );
};

const BiddingPlatform: React.FC<BiddingProps> = ({ data, status, bids }) => {
  const [bidStatus, setBidStatus] = useState<BiddingStatus>(status);
  const [type, setType] = useState<"ALL" | "FAVOURITES">("ALL");

  // incident id is in the URL
  const { incident } = useParams<{ incident: string }>();

  const createBid = api.clients.createBid.useMutation({
    onSuccess: () => {
      toast("Bid initiated", {
        description:
          "Bid has been initiated. From now on, tuners will file their bids for your product. The process will end in 72 hours, starting now.",
        dismissible: false,
      });
      setBidStatus(BiddingStatus.STARTED);
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex flex-row gap-4 items-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Tuner
            <span className="text-greenish"> BID&trade;</span>
          </h1>
          <HelpTooltip />
        </div>
        <BidStatus bidStatus={bidStatus} bid={data || undefined} />
        <Separator />
      </div>

      <div className="flex items-center justify-center w-full">
        {
          {
            [BiddingStatus.INIT]: (
              <div className="flex flex-col gap-8 items-center">
                <Tabs defaultValue="all">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="all" onClick={() => setType("ALL")}>
                      I want to start the bid between all tuners.
                    </TabsTrigger>
                    <TabsTrigger
                      value="favourites"
                      onClick={() => setType("FAVOURITES")}
                    >
                      I want to start the bid between my favourites only.
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <InitiateBidButton
                  type={type}
                  startBid={() => {
                    createBid.mutate({
                      type,
                      incidentId: incident,
                    });
                  }}
                />
              </div>
            ),
            [BiddingStatus.STARTED]: (
              <div className="flex flex-col w-full gap-3">
                <BidData data={data} bids={bids || undefined} />
              </div>
            ),
            [BiddingStatus.IN_PROGRESS]: (
              <p className="text-2xl font-bold tracking-tighter">
                Bid process is ongoing. Please wait.
              </p>
            ),
            [BiddingStatus.FINISHED]: (
              <p className="text-2xl font-bold tracking-tighter">
                Bid process has been completed. You can now view the bids.
              </p>
            ),

            [BiddingStatus.CANCELLED]: (
              <p className="text-2xl font-bold tracking-tighter">
                Bid process has been closed.
              </p>
            ),

            [BiddingStatus.REJECTED]: (
              <p className="text-2xl font-bold tracking-tighter">
                Bid process has expired.
              </p>
            ),
          }[bidStatus]
        }
      </div>
    </div>
  );
};

export default BiddingPlatform;
