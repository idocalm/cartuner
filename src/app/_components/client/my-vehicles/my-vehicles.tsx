import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";
import ErrorPanel from "../shared/error";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { v4 as uuid } from "uuid";
import { Terminal } from "lucide-react";

import { useState } from "react";
import VehicleView from "../vehicle-view/vehicle-view";
import { Vehicle } from "~/app/types";
import NewVehicleSheet from "./new-vehicle-sheet";
import VehicleCard from "./vehicle-card";

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
        <div className="h-full px-4 py-6 lg:px-8 flex flex-col gap-3">
          <h1 className="text-4xl font-bold tracking-tight">
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
