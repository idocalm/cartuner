import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { useState } from "react";
import { Icons } from "~/components/ui/icons";
import { Button } from "~/components/ui/button";
import NewIncidentBody from "./new-incident-body";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";

const NewIncidentSheet: React.FC = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [date, setDate] = useState<Date | null>(null);
  const [description, setDescription] = useState<string>("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [hitbox, setHitbox] = useState<number[]>([]);
  const [vehicleId, setVehicleId] = useState<string | null>(null);
  const [location, setLocation] = useState<string>("");

  const uploadIncident = api.clients.createIncident.useMutation({
    onSuccess: () => {
      setLoading(false);
      setSheetOpen(false);

      toast({
        title: "Incident reported",
        description: "The incident has been created successfully.",
        duration: 2000,
      });
    },
    onError: () => {
      setLoading(false);

      toast({
        title: "Failed to report incident",
        description: "An error occurred while reporting the incident.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  return (
    <Sheet open={sheetOpen} onOpenChange={(open) => setSheetOpen(open)}>
      <SheetTrigger
        asChild
        onClick={() => {
          setSheetOpen(true);
        }}
      >
        <Button variant="outline">New incident</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New incident</SheetTitle>
          <SheetDescription>
            Fill out the form below to report a new incident. Once you save the
            changes, a bid will be created and sent to the service providers
            according to your preferences below.
          </SheetDescription>
        </SheetHeader>
        <NewIncidentBody
          date={date}
          description={description}
          photos={photos}
          location={location}
          hitbox={hitbox}
          setLocation={setLocation}
          setHitbox={setHitbox}
          setVehicleId={setVehicleId}
          setDescription={setDescription}
          setPhotos={setPhotos}
          setDate={setDate}
        />
        <SheetFooter>
          <Button
            type="submit"
            disabled={loading}
            onClick={() => {
              setLoading(true);
              uploadIncident.mutate({
                date: date!,
                description,
                photos,
                hitbox,
                vehicleId: vehicleId!,
                location,
              });
            }}
          >
            {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default NewIncidentSheet;
