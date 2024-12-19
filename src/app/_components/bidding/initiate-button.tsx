import { Button } from "~/components/ui/button";

const InitiateBidButton: React.FC<{
  startBid: () => void;
  type: string;
}> = ({ startBid, type }) => {
  return (
    <div className="flex items-center bg-greenish rounded-full justify-center p-1 shadow-lg">
      <Button
        className="w-52 h-52 rounded-full text-3xl tracking-tighter font-extrabold"
        variant="secondary"
        onClick={startBid}
      >
        <div className="flex flex-col items-center">
          START
          <span className="text-sm font-semibold">{type}</span>
        </div>
      </Button>
    </div>
  );
};

export default InitiateBidButton;
