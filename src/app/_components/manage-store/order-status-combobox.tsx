import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { cn } from "~/lib/utils";
import { OrderStatus } from "@prisma/client";
import { useState } from "react";

const ChangeOrderStatus: React.FC<{
  currentStatus: OrderStatus;
  setStatus: (status: OrderStatus) => void;
}> = ({ currentStatus, setStatus }) => {
  const [open, setOpen] = useState(false);

  const statuses = Object.values(OrderStatus).map((status) => ({
    value: status,
    label: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(),
  }));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {currentStatus
            ? statuses.find((status) => status.value === currentStatus)?.label
            : "Select framework..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Select status" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {statuses.map((status) => (
                <CommandItem
                  key={status.value}
                  value={status.value}
                  onSelect={(currentValue) => {
                    if (currentValue === currentStatus) {
                      return;
                    }
                    setStatus(currentValue as OrderStatus);
                    setOpen(false);
                  }}
                >
                  {status.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      currentStatus === status.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ChangeOrderStatus;
