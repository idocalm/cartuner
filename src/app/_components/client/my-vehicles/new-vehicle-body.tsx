import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { brands, models } from "~/data/vehicle-data";
import {
  CalendarDays,
  Check,
  ChevronsUpDown,
  CircleAlert,
  FileDigit,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import Link from "next/link";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import React, { type Dispatch, type SetStateAction } from "react";
import { Button } from "~/components/ui/button";

interface NewVehicleProps {
  brandOpen: boolean;
  brand: keyof typeof models | null;
  setBrandOpen: (value: boolean) => void;
  setBrand: Dispatch<
    SetStateAction<
      | "different"
      | "toyota"
      | "ford"
      | "honda"
      | "chevrolet"
      | "bmw"
      | "audi"
      | "mercedes"
      | "nissan"
      | "hyundai"
      | "volkswagen"
      | "subaru"
      | null
    >
  >;
  modelOpen: boolean;
  model: string | null;
  setModelOpen: (value: boolean) => void;
  setModel: Dispatch<SetStateAction<string | null>>;
  year: number | null;
  setYear: Dispatch<SetStateAction<number | null>>;
  plate: string | null;
  setPlate: Dispatch<SetStateAction<string | null>>;
  vin: string | null;
  setVin: Dispatch<SetStateAction<string | null>>;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
}

const VehicleName: React.FC<{
  vehName: string;
  setName: Dispatch<SetStateAction<string>>;
}> = ({ vehName, setName }) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="name" className="text-right">
        Nickname
      </Label>
      <Input
        id="name"
        onChange={(e) => setName(e.target.value)}
        className="col-span-3"
        value={vehName}
      />
    </div>
  );
};

const VehicleBrand: React.FC<{
  brandOpen: boolean;
  brand: keyof typeof models | null;
  setBrand: Dispatch<
    SetStateAction<
      | "different"
      | "toyota"
      | "ford"
      | "honda"
      | "chevrolet"
      | "bmw"
      | "audi"
      | "mercedes"
      | "nissan"
      | "hyundai"
      | "volkswagen"
      | "subaru"
      | null
    >
  >;
  setBrandOpen: (value: boolean) => void;
}> = ({ brandOpen, brand, setBrand, setBrandOpen }) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="brand" className="text-right">
        Brand
      </Label>
      <Popover open={brandOpen} onOpenChange={setBrandOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={brandOpen}
            className="w-[200px] justify-between"
          >
            {brand
              ? brands.find((currBrand) => currBrand.value === brand)?.label
              : "Select brand..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search brand..." />
            <CommandList>
              <CommandEmpty>No brand found.</CommandEmpty>
              <CommandGroup>
                {brands.map((currBrand) => (
                  <CommandItem
                    key={currBrand.value}
                    value={currBrand.value}
                    onSelect={(currentValue: string) => {
                      const selected = currentValue as keyof typeof models;
                      setBrand(selected === brand ? null : selected);
                      setBrandOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        brand === currBrand.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {currBrand.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const VehicleModel: React.FC<{
  modelOpen: boolean;
  model: string | null;
  setModelOpen: (value: boolean) => void;
  setModel: Dispatch<SetStateAction<string | null>>;
  brand: keyof typeof models | null;
}> = ({ modelOpen, model, setModelOpen, setModel, brand }) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="model" className="text-right">
        Model
      </Label>
      <Popover open={modelOpen} onOpenChange={setModelOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={modelOpen}
            className="w-[200px] justify-between"
          >
            {model && brand
              ? models[brand]!.find((currModel) => currModel.value === model)
                  ?.label
              : "Select model..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search model..." />
            <CommandList>
              <CommandEmpty>No model found.</CommandEmpty>
              <CommandGroup>
                {brand &&
                  models[brand].map((currModel) => (
                    <CommandItem
                      key={currModel.value}
                      value={currModel.value}
                      onSelect={(currentValue) => {
                        setModel(currentValue === model ? "" : currentValue);
                        setModelOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          brand === currModel.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {currModel.label}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const VehicleYear: React.FC<{
  year: number | null;
  setYear: Dispatch<SetStateAction<number | null>>;
}> = ({ year, setYear }) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="year" className="text-right">
        <div className="flex items-center justify-end flex-row">
          Year
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <CircleAlert className="h-4 w-4 ml-2" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm text-muted-foreground">
                  The year the vehicle was manufactured
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </Label>

      <InputOTP
        id="year"
        maxLength={4}
        value={year?.toString()}
        onChange={(value: string) => {
          setYear(parseInt(value));
        }}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
};

const VehiclePlate: React.FC<{
  plate: string | null;
  setPlate: Dispatch<SetStateAction<string | null>>;
}> = ({ plate, setPlate }) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="license" className="text-right">
        <div className="flex items-center justify-end flex-row">
          Plate
          <HoverCard>
            <HoverCardTrigger asChild>
              <FileDigit className="h-4 w-4 ml-2" />
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between space-x-4">
                <Avatar>
                  <AvatarImage src="https://github.com/vercel.png" />
                  <AvatarFallback>VC</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">@nextjs</h4>
                  <p className="text-sm">
                    The React Framework – created and maintained by @vercel.
                  </p>
                  <div className="flex items-center pt-2">
                    <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                    <span className="text-xs text-muted-foreground">
                      Joined December 2021
                    </span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </Label>
      <InputOTP
        id="plate"
        maxLength={7}
        value={plate?.toUpperCase()}
        onChange={(value: string) => {
          setPlate(value.toUpperCase());
        }}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
          <InputOTPSlot index={6} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
};

const VehicleVIN: React.FC<{
  vin: string | null;
  setVin: Dispatch<SetStateAction<string | null>>;
}> = ({ vin, setVin }) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="vin" className="text-right">
        <div className="flex items-center justify-end flex-row">
          VIN
          <HoverCard>
            <HoverCardTrigger asChild>
              <CircleAlert className="h-4 w-4 ml-2" />
            </HoverCardTrigger>
            <HoverCardContent className="w-80 flex flex-col justify-center items-center gap-3">
              <p className="text-sm text-center text-muted-foreground">
                The Vehicle Identification Number (VIN) is a unique code used by
                the automotive industry to identify individual motor vehicles,
                towed vehicles, motorcycles, scooters and mopeds.
              </p>
              <Link href="https://en.wikipedia.org/wiki/Vehicle_identification_number">
                Learn more
              </Link>
            </HoverCardContent>
          </HoverCard>
        </div>
      </Label>
      <Input
        id="vin"
        className="col-span-3"
        value={vin?.toUpperCase()}
        onChange={(e) => setVin(e.target.value.toUpperCase())}
      />
    </div>
  );
};

const NewVehicleBody: React.FC<NewVehicleProps> = ({
  brandOpen,
  brand,
  setBrand,
  setBrandOpen,
  modelOpen,
  model,
  setModel,
  setModelOpen,
  year,
  setYear,
  plate,
  setPlate,
  vin,
  setVin,
  name,
  setName,
}) => {
  return (
    <div className="grid gap-4 py-4">
      <VehicleName vehName={name} setName={setName} />
      <VehicleBrand
        brandOpen={brandOpen}
        brand={brand}
        setBrand={setBrand}
        setBrandOpen={setBrandOpen}
      />
      {brand && brand != "different" && models[brand].length > 0 && (
        <VehicleModel
          modelOpen={modelOpen}
          model={model}
          setModelOpen={setModelOpen}
          setModel={setModel}
          brand={brand}
        />
      )}

      <VehicleYear year={year} setYear={setYear} />
      <VehiclePlate plate={plate} setPlate={setPlate} />
      <VehicleVIN vin={vin} setVin={setVin} />
    </div>
  );
};

export default NewVehicleBody;
