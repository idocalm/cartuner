import { InfoCircledIcon } from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Separator } from "~/components/ui/separator";

const HelpTooltip: React.FC = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <InfoCircledIcon className="h-6 w-6 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex flex-col gap-2 rounded-md p-2 bg-muted-background w-80">
            <h1 className="text-lg font-bold tracking-tighter">
              What is Tuner
              <span className="text-greenish"> BID&trade;</span>?
            </h1>
            <p>
              Tuner<span className="text-greenish"> BID&trade; </span>
              is a feature that allows you get the best offer and sign a deal
              with the tuner of your choice.
            </p>
            <Separator />
            <p>
              Once you start the bid, tuners will have 72 hours to supply their
              offers. Once the process is over, you'll be able to continue with
              an offer of your choice, or enter a negotiation with the tuner.
            </p>
            <Separator />

            <p className="text-greenish">You can cancel the bid at any time.</p>

            <p className="text-muted-foreground">
              <strong>Tip:</strong> You can choose to start the bid between all
              tuners, or just your favourites.
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HelpTooltip;
