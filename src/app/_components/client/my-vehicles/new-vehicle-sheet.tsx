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
import { Icons } from "~/components/ui/icons";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { AlertDialogAction } from "~/components/ui/alert-dialog";

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

export default NewVehicleSheet;
