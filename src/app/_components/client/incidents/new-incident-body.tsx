import { Label } from "~/components/ui/label";
import { CalendarIcon, Check, ChevronsUpDown, CircleAlert } from "lucide-react";
import React, { useState, type Dispatch, type SetStateAction } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { Calendar } from "~/components/ui/calendar";
import { format } from "date-fns";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { api } from "~/trpc/react";
import type { Vehicle } from "@prisma/client";
import VehicleSketchSelector, { type Selection } from "./vehicle-hitbox";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

interface NewIncidentProps {
  date: Date | null;
  description: string;
  photos: string[];
  hitbox: number[];
  location: string;
  setHitbox: Dispatch<SetStateAction<number[]>>;
  setVehicleId: Dispatch<SetStateAction<string | null>>;
  setDescription: Dispatch<SetStateAction<string>>;
  setPhotos: Dispatch<SetStateAction<string[]>>;
  setDate: Dispatch<SetStateAction<Date | null>>;
  setLocation: Dispatch<SetStateAction<string>>;
}

const SelectVehicle: React.FC<{
  setVehicleId: Dispatch<SetStateAction<string | null>>;
}> = ({ setVehicleId }) => {
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [veh, setVeh] = useState<Vehicle | null>(null);

  const setVehicle = (vehicle: Vehicle | null) => {
    setVeh(vehicle);
    setVehicleId(vehicle ? vehicle.id : null);
  };

  const payload = api.clients.vehicles.useQuery("all");

  if (payload.isLoading) {
    return (
      <div className="flex flex-row w-full justify-start items-center  gap-4">
        <Label htmlFor="vehicle">Involved vehicle</Label>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={vehicleOpen}
          className="w-[200px] justify-between"
        >
          Loading...
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </div>
    );
  }

  if (payload.error || !payload.data) {
    return (
      <div className="flex flex-row w-full justify-start items-center  gap-4">
        <Label htmlFor="vehicle">Involved vehicle</Label>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={vehicleOpen}
          className="w-[200px] justify-between"
        >
          <CircleAlert className="mr-2 h-4 w-4 opacity-50" />
          Error fetching vehicles
        </Button>
      </div>
    );
  }

  const vehicles = payload.data as Vehicle[];

  return (
    <div className="flex flex-row w-full justify-start items-center  gap-4">
      <Label htmlFor="vehicle" className="text-right">
        Involved vehicle
      </Label>
      <Popover open={vehicleOpen} onOpenChange={setVehicleOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={vehicleOpen}
            className="w-[200px] justify-between"
          >
            {veh ? veh.name : "Select vehicle..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search vehicle..." />
            <CommandList>
              <CommandEmpty>No vehicle found.</CommandEmpty>
              <CommandGroup>
                {vehicles.map((currVeh) => (
                  <CommandItem
                    key={currVeh.id}
                    value={currVeh.name}
                    onSelect={(currentValue) => {
                      if (veh?.name === currentValue) {
                        setVehicle(null);
                      }

                      setVehicle(currVeh);
                      setVehicleOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        veh?.id === currVeh.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {currVeh.name}
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

const IncidentDate: React.FC<{
  date: Date | null;
  setDate: Dispatch<SetStateAction<Date | null>>;
}> = ({ date, setDate }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex flex-row gap-4 items-center">
          <Label className="text-right">Date</Label>
          <Button
            variant={"outline"}
            className={cn("w-[240px] pl-3 text-left font-normal")}
          >
            {date ? format(date, "PPP") : <span>Pick a date</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date ?? new Date()}
          onSelect={(date) => setDate(date! as Date)}
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

const VehicleHitBox: React.FC<{
  hitbox: number[];
  setHitbox: Dispatch<SetStateAction<number[]>>;
}> = ({ hitbox, setHitbox }) => {
  const selection: Selection = {
    x: hitbox[0] ?? 0,
    y: hitbox[1] ?? 0,
    width: hitbox[2] ?? 0,
    height: hitbox[3] ?? 0,
  };

  const setSelection = (selection: Selection) => {
    setHitbox([selection.x, selection.y, selection.width, selection.height]);
  };

  return (
    <div className="flex flex-col w-full justify-start items-center gap-4 my-4">
      <Label htmlFor="hitbox">Roughly mark the hit box on the vehicle</Label>
      <VehicleSketchSelector
        setSelection={setSelection}
        selection={selection}
      />
    </div>
  );
};

const IncidientDescription: React.FC<{
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
}> = ({ description, setDescription }) => {
  return (
    <div className="flex flex-col w-full gap-4">
      <Label htmlFor="description">Description</Label>
      <Textarea
        id="description"
        className="w-full h-24 p-2 rounded-md text-sm"
        placeholder="To the best of your ability, describe the events that led to the incident."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>
  );
};

const IncidentLocation: React.FC<{
  location: string;
  setLocation: Dispatch<SetStateAction<string>>;
}> = ({ location, setLocation }) => {
  return (
    <div className="flex flex-col w-full gap-4">
      <Label htmlFor="location">Location</Label>
      <Input
        id="location"
        className="w-full p-2 rounded-md text-sm"
        placeholder="Where did the incident happen?"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
    </div>
  );
};

const NewIncidentBody: React.FC<NewIncidentProps> = ({
  date,
  description,
  hitbox,
  location,
  setDate,
  setVehicleId,
  setDescription,
  setLocation,
  setHitbox,
}) => {
  return (
    <div className="grid gap-4 py-4">
      <IncidentDate date={date} setDate={setDate} />
      <SelectVehicle setVehicleId={setVehicleId} />
      <IncidentLocation location={location} setLocation={setLocation} />
      <IncidientDescription
        description={description}
        setDescription={setDescription}
      />

      <VehicleHitBox hitbox={hitbox} setHitbox={setHitbox} />
    </div>
  );
};

export default NewIncidentBody;
