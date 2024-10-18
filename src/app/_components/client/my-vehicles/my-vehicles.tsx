import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";
import ErrorPanel from "../shared/error";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { v4 as uuid } from "uuid";
import {
  CarFront,
  FerrisWheel,
  PlusIcon,
  Terminal,
  Trash2,
} from "lucide-react";
import { Icons } from "~/components/ui/icons";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { models } from "~/data/vehicle-data";

import { useState } from "react";
import NewVehicleBody from "./new-vehicle-body";
import { useToast } from "~/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "~/components/ui/alert-dialog";
import {
  AlertDialogHeader,
  AlertDialogFooter,
} from "~/components/ui/alert-dialog";
import { Input } from "~/components/ui/input";
import VehicleView from "../vehicle-view/vehicle-view";
import { Vehicle } from "~/app/types";

const NewVehicleSheet: React.FC = () => {
  const [brandOpen, setBrandOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [brand, setBrand] = useState<keyof typeof models | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [plate, setPlate] = useState<string | null>(null);
  const [vin, setVin] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createVehicle = api.clients.createVehicle.useMutation({
    onSuccess: () => {
      setBrand(null);
      setModel(null);
      setYear(null);
      setPlate(null);
      setVin(null);
      setName("");
      setBrandOpen(false);
      setModelOpen(false);
      setLoading(false);
      setSheetOpen(false);

      toast({
        title: "Vehicle added",
        description: "The vehicle has been added to your garage.",
        duration: 2000,
      });
    },
    onError: (error) => {
      setLoading(false);

      toast({
        title: "Failed to add vehicle",
        description: "An error occurred while adding the vehicle.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  const submit = async () => {
    setLoading(true);
    await createVehicle.mutateAsync({
      brand: brand!,
      model: model!,
      year: year!,
      plate: plate!,
      name,
      vin: vin!,
      type: "all", // TODO: Implement type selection
      notes: "",
    });
    setLoading(false);
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={(open) => setSheetOpen(open)}>
      <SheetTrigger
        asChild
        onClick={() => {
          setSheetOpen(true);
        }}
      >
        <Button variant="outline">New vehicle</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add a new vehicle</SheetTitle>
          <SheetDescription>
            Fill out the form below to add a new vehicle to your garage, so you
            can keep track of it&apos;s maintenancep and incidents.
          </SheetDescription>
        </SheetHeader>
        <NewVehicleBody
          brand={brand}
          model={model}
          setBrand={setBrand}
          setModel={setModel}
          brandOpen={brandOpen}
          setBrandOpen={setBrandOpen}
          modelOpen={modelOpen}
          setModelOpen={setModelOpen}
          year={year}
          setYear={setYear}
          plate={plate}
          setPlate={setPlate}
          vin={vin}
          setVin={setVin}
          name={name}
          setName={setName}
        />
        <SheetFooter>
          <Button type="submit" onClick={() => submit()} disabled={loading}>
            {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

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

const VehicleShowing: React.FC<{
  type: string;
  showDetails: (id: string) => void;
}> = ({ type, showDetails }) => {
  const vehicles = api.clients.vehicles.useQuery(type);

  if (vehicles.isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-auto">
        {Array.from({ length: 10 }).map((_) => (
          <div key={uuid()} className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-[250px]" />
              <Skeleton className="h-6 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  } else if (vehicles.error) {
    return <ErrorPanel message="An error occurred while fetching vehicles" />;
  }

  if (vehicles.data?.length === 0) {
    return (
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>
          Seems like you have no vehicles registered in this category
        </AlertTitle>
        <AlertDescription>
          You can always add a new vehicle by clicking &ldquo;New vehicle&ldquo;
          button.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-auto">
      {vehicles.data?.map((vehicle: Vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          showDetails={showDetails}
        />
      ))}
    </div>
  );
};

const MyVehicles: React.FC<{ name: string }> = ({ name }) => {
  const [viewing, setViewing] = useState<boolean>(false);
  const [viewVehicle, setViewVehicle] = useState<string>("");

  const showDetails = (id: string) => {
    setViewVehicle(id);
    setViewing(true);
  };

  if (viewing) {
    return <VehicleView id={viewVehicle} revert={() => setViewing(false)} />;
  }

  return (
    <div className="grid">
      <div className="col-span-3 lg:col-span-4 lg:border-l">
        <div className="h-full px-4 py-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight my-5">
            Welcome back, {name}
          </h1>
          <Tabs defaultValue="all" className="h-full space-y-6">
            <div className="space-between flex items-center">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="sedans">Sedans</TabsTrigger>
                <TabsTrigger value="suvs">SUV&apos;s</TabsTrigger>
                <TabsTrigger value="hatchbacks">Hatchbacks</TabsTrigger>
                <TabsTrigger value="motorcycles">Motorcycles</TabsTrigger>
                <TabsTrigger value="convertibles">Convertibles</TabsTrigger>
              </TabsList>
              <div className="ml-auto mr-4 flex flex-row gap-3">
                <NewVehicleSheet />
                <Button variant="secondary">New Incident</Button>
              </div>
            </div>
            <TabsContent value="all" className="border-none p-0 outline-none">
              <VehicleShowing type="all" showDetails={showDetails} />
            </TabsContent>
            <TabsContent
              value="sedans"
              className="border-none p-0 outline-none"
            >
              <VehicleShowing type="sedans" showDetails={showDetails} />
            </TabsContent>
            <TabsContent value="suvs" className="border-none p-0 outline-none">
              <VehicleShowing type="suvs" showDetails={showDetails} />
            </TabsContent>
            <TabsContent
              value="hatchbacks"
              className="border-none p-0 outline-none"
            >
              <VehicleShowing type="hatchbacks" showDetails={showDetails} />
            </TabsContent>
            <TabsContent
              value="motorcycles"
              className="border-none p-0 outline-none"
            >
              <VehicleShowing type="motorcycles" showDetails={showDetails} />
            </TabsContent>
            <TabsContent
              value="convertibles"
              className="border-none p-0 outline-none"
            >
              <VehicleShowing type="convertibles" showDetails={showDetails} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MyVehicles;
