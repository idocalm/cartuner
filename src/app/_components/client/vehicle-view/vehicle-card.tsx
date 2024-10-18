import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Icons } from "~/components/ui/icons";
import type { Vehicle } from "~/app/types";
import { useState } from "react";
import Loading from "../shared/loading";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";

const VehicleView: React.FC<{
  vehicle: Vehicle;
}> = ({ vehicle }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const [notes, setNotes] = useState<string>(vehicle.notes || "");

  const [period, setPeriod] = useState<"week" | "month" | "year" | "lifetime">(
    "week"
  );

  const brand = vehicle
    ? vehicle.brand.charAt(0).toUpperCase() + vehicle.brand.slice(1)
    : "";

  const model = vehicle
    ? vehicle.model.charAt(0).toUpperCase() + vehicle.model.slice(1)
    : "";

  const updateNotes = api.clients.updateVehicleNotes.useMutation({
    onSuccess: () => {
      setLoading(false);
      toast({
        title: "Success",
        description: "Notes saved successfully",
        duration: 1000,
      });
    },
    onError: () => {
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to save notes",
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="min-w-[350px]">
      <CardHeader>
        <CardTitle>
          A {vehicle?.year} {brand && model ? `${brand} ${model}` : "Vehicle"}
        </CardTitle>
        <CardDescription>
          View all the information about your vehicle in one place.
        </CardDescription>
        <Separator />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">
              Show me data from the last:{" "}
            </p>
            <Select
              onValueChange={(value) => {
                setPeriod(value as "week" | "month" | "year" | "lifetime");
              }}
            >
              <SelectTrigger id="timeframe">
                <SelectValue placeholder="Week" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="year">Year</SelectItem>
                <SelectItem value="lifetime">Lifetime</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <DataView period={period} id={vehicle.id} />
          <div className="flex flex-col gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              placeholder="Add notes about your vehicle"
              onChange={(event) => {
                setNotes(event.target.value);
              }}
            />
          </div>

          <Button
            onClick={() => {
              setLoading(true);
              updateNotes.mutate({
                id: vehicle.id,
                notes: notes,
              });
            }}
            disabled={loading}
          >
            {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const DataView: React.FC<{
  period: "week" | "month" | "year" | "lifetime";
  id: string;
}> = ({ period, id }) => {
  const incidents = api.clients.loadVehicleIncidents.useQuery({
    vehicleId: id,
    period,
  });

  const repairs = api.clients.loadVehicleRepairs.useQuery({
    vehicleId: id,
    period,
  });

  if (incidents.isLoading || repairs.isLoading) {
    return (
      <Loading
        title="Loading..."
        message="Sit tight while we sort things up here..."
      />
    );
  }

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <p className="text-xl font-bold tracking-tighter"> Incidents: </p>
        <div className="flex justify-center items-center w-8 h-8 bg-muted-foreground rounded-full">
          <p className="text-white font-bold">{incidents.data?.length}</p>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center">
        <p className="text-xl font-bold tracking-tighter"> Repairs: </p>
        <div className="flex justify-center items-center w-8 h-8 bg-muted-foreground rounded-full">
          <p className="text-white font-bold">{repairs.data?.length}</p>
        </div>
      </div>
      <Separator />
    </>
  );
};

export default VehicleView;
