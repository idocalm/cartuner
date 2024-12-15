import { useState } from "react";
import { CarFront, FerrisWheel, PlusIcon, Trash2 } from "lucide-react";

import { useToast } from "~/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "~/components/ui/alert-dialog";
import {
  AlertDialogHeader,
  AlertDialogFooter,
} from "~/components/ui/alert-dialog";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Vehicle } from "@prisma/client";

/* TODO: Implement this interface in the VehicleCard
interface VehicleCardProps extends Vehicle {
  showDetails: (id: string) => void;
}
*/

const VehicleCard: React.FC<{
  vehicle: {
    id: string;
    name: string;
    brand: string;
    model: string;
    year: number;
    plate: string;
    vin: string;
    type: string;
  };
  showDetails: (id: string) => void;
}> = ({ vehicle, showDetails }) => {
  const { toast } = useToast();

  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteVehicle = api.clients.deleteVehicle.useMutation({
    onSuccess: () => {
      toast({
        title: "Vehicle deleted",
        description: "The vehicle has been deleted from your garage.",
        duration: 2000,
      });
      setDeleteConfirmation("");
      setShowDeleteDialog(false);
    },
    onError: () => {
      toast({
        title: "Failed to delete vehicle",
        description: "An error occurred while deleting the vehicle.",
        variant: "destructive",
        duration: 3000,
      });
      setDeleteConfirmation("");
      setShowDeleteDialog(false);
    },
  });

  return (
    <div
      key={vehicle.id}
      className="flex items-center space-x-4 p-4 rounded-lg bg-secondary shadow-lg"
    >
      <div className="space-y-2 w-full flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <div className="w-full flex flex-row justify-between items-center">
            <h3 className="text-lg font-semibold">{vehicle.name}</h3>
            <div className="flex flex-row gap-2">
              <Button>
                <PlusIcon className="h-4 w-4" />
              </Button>
              <AlertDialog
                open={showDeleteDialog}
                onOpenChange={(open) => setShowDeleteDialog(open)}
              >
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will PERMANENTLY DELETE
                      your vehicle. If you&apos;re sure, type{" "}
                      <span className="font-extrabold tracking-tighter">
                        {vehicle.name}
                      </span>{" "}
                      in the input below and click &ldquo;Continue&ldquo;.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <Input
                    placeholder="Type the vehicle name"
                    onChange={(e) => {
                      setDeleteConfirmation(e.target.value);
                    }}
                  />

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        if (deleteConfirmation !== vehicle.name) {
                          toast({
                            title: "Confirmation failed",
                            description:
                              "Please type the vehicle name correctly.",
                            variant: "destructive",
                            duration: 3000,
                          });
                          return;
                        }

                        deleteVehicle.mutate({ id: vehicle.id });
                      }}
                    >
                      Continue
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            A {vehicle.year}{" "}
            {vehicle.brand.charAt(0).toUpperCase() + vehicle.brand.slice(1)}{" "}
            {vehicle.model.charAt(0).toUpperCase() + vehicle.model.slice(1)}
          </p>
          <div className="text-sm  flex flex-row gap-2 items-center">
            <CarFront />
            Plate number:{" "}
            <span className="text-muted-foreground">{vehicle.plate}</span>
          </div>
          <div className="text-sm  flex flex-row gap-2 items-center">
            <FerrisWheel />
            VIN number:{" "}
            <p className="text-sm text-muted-foreground">{vehicle.vin}</p>
          </div>
        </div>
        <Button
          variant="default"
          className="w-full"
          onClick={() => {
            showDetails(vehicle.id);
          }}
        >
          View details
        </Button>
      </div>
    </div>
  );
};

export default VehicleCard;
