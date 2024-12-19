import { BiddingData, BiddingStatus } from "@prisma/client";

const BidStatus: React.FC<{ bidStatus: BiddingStatus; bid?: BiddingData }> = ({
  bidStatus,
  bid,
}) => {
  if (bidStatus === BiddingStatus.INIT) {
    return (
      <p className="text-lg font-medium tracking-tighter text-muted-foreground">
        Press the button below to start, or hover the info icon to learn more.
      </p>
    );
  }

  if (bidStatus === BiddingStatus.STARTED && bid) {
    // calculate the remaining time (now - bidTime)
    const diff = Math.abs(new Date().getTime() - bid.dueDate.getTime());
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    const formatTime = `${hours} hours, ${minutes} minutes`;

    return (
      <p className="text-lg font-medium tracking-tighter text-muted-foreground">
        The bid has been initiated. Tuners are now filing their bids.
        <span className="text-greenish"> Remaining time: {formatTime}</span>
      </p>
    );
  }

  return <div className="flex flex-row gap-4 items-center">TODO</div>;
};

export default BidStatus;
