import BreadcrumbMenu from "../shared/breadcrumb-menu";
import { api } from "~/trpc/react";

import { useToast } from "~/hooks/use-toast";
import Loading from "../shared/loading";
import VehicleCard from "./vehicle-card";
import { Vehicle } from "~/app/types";
import { Separator } from "~/components/ui/separator";

import { Card, CardContent } from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";

const VehicleView: React.FC<{
  id: string;
  revert: () => void;
}> = ({ id, revert }) => {
  const { toast } = useToast();

  const vehicle = api.clients.findVehicleById.useQuery(id);

  if (vehicle.isLoading) {
    return <Loading title="Loading vehicle..." message="Sit tight" />;
  } else if (vehicle.error) {
    toast({
      title: "Error",
      description: "Failed to fetch vehicle",
      variant: "destructive",
    });
    return;
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-6 lg:px-8 w-full">
      <BreadcrumbMenu
        items={[
          {
            name: "My vehicles",
            onClick: () => {
              revert();
            },
          },
          { name: vehicle.data?.name || "Vehicle", onClick: () => {} },
        ]}
      />

      <div className="flex flex-row w-full justify-between h-full gap-5">
        <div className="h-full w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-bold text-white tracking-tighter">
              {vehicle.data?.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {vehicle.data?.plate}
            </p>
          </div>
          <p className="text-3xl text-white font-bold tracking-tighter">
            Statistics
          </p>
          <Separator />
          <div className="flex flex-row gap-2 items-end">
            <span className="text-muted-foreground text-2xl text-white font-bold">
              1)
            </span>
            <p className="text-lg font-bold tracking-tighter text-muted-foreground">
              Over the last year, you have spent an average of
            </p>
            <span className="text-white text-4xl font-semibold">$1000</span>
            <p className="text-lg font-bold tracking-tighter text-muted-foreground">
              on this vehicle.
            </p>
          </div>
          <div className="flex flex-row gap-2 items-end">
            <span className="text-muted-foreground text-2xl font-bold text-white">
              2)
            </span>
            <p className="text-lg font-bold tracking-tighter text-muted-foreground">
              You have had
            </p>
            <span className="text-white text-4xl font-semibold">3</span>
            <p className="text-lg font-bold tracking-tighter text-muted-foreground">
              incidents this year.
            </p>
          </div>
          <Separator />
          <p className="text-3xl text-white font-bold tracking-tighter">
            Recent Incidents
          </p>

          <Carousel
            opts={{
              align: "start",
            }}
            className="mx-8"
          >
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-3xl font-semibold">
                          {index + 1}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <VehicleCard vehicle={vehicle.data as Vehicle} />
      </div>
    </div>
  );
};

export default VehicleView;
