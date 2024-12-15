import { api } from "~/trpc/react";
import ErrorPanel from "../shared/error";
import Loading from "../shared/loading";
import NewIncidentSheet from "./new-incident-sheet";
import { Incident } from "@prisma/client";
import IncidentCard from "./incident-card";

const Incidents = () => {
  const incidents = api.clients.loadIncidents.useQuery();

  if (incidents.isLoading) {
    return <Loading title="Loading incidents..." message="Sit tight" />;
  }

  if (incidents.error || !incidents.data) {
    return <ErrorPanel message="Failed to fetch orders" />;
  }

  if (incidents.data.length === 0) {
    return (
      <div className="flex flex-col h-full w-full">
        <div className="col-span-3 lg:col-span-4 lg:border-l">
          <div className="h-full px-4 py-6 lg:px-8 flex flex-col gap-2">
            <div className="flex flex-col gap-1 mb-4">
              <h1 className="text-4xl font-bold tracking-tight ">Incidents</h1>
              <p className="text-muted-foreground">
                Here you can see all your recent incidents, and their status.
              </p>
            </div>

            <div className="flex flex-col gap-4 items-center justify-center w-full h-full">
              <p className="text-md text-bold text-muted-foreground">
                You haven&apos;t reported any incidents yet
              </p>

              <NewIncidentSheet />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="col-span-3 lg:col-span-4 lg:border-l">
        <div className="h-full px-4 py-6 lg:px-8 flex flex-col gap-2">
          <div className="flex flex-col gap-1 mb-4">
            <div className="flex flex-row justify-between items-center">
              <h1 className="text-4xl font-bold tracking-tight ">
                Recent incidents
              </h1>
              <NewIncidentSheet />
            </div>
            <p className="text-muted-foreground">
              Here you can see all your recent incidents, and their status.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-auto">
            {incidents.data?.map((incident: Incident) => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Incidents;
