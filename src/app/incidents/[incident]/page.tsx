"use client";

import type { Incident } from "@prisma/client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import VehicleSketchSelector, {
  type Selection,
} from "~/app/_components/client/incidents/vehicle-hitbox";
import ErrorPanel from "~/app/_components/client/shared/error";
import Loading from "~/app/_components/client/shared/loading";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";
import { formatString } from "~/utils/misc";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import BiddingPlatform from "~/app/_components/bidding/platform";

const IncidentView: React.FC<{ incident: Incident }> = ({ incident }) => {
  const [description, setDescription] = useState(incident.description);

  const hitbox: Selection = {
    x: incident.hitbox[0] || 0,
    y: incident.hitbox[1] || 0,
    width: incident.hitbox[2] || 0,
    height: incident.hitbox[3] || 0,
  };

  return (
    <div className="flex flex-row gap-4 rounded-mb border py-4 px-6">
      <div className="flex flex-col gap-4 items-start">
        <div className="flex flex-col gap-1">
          <Label htmlFor="id">Incident ID</Label>
          <p id="id">{incident.id}</p>
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            className="w-96"
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button
            onClick={() => {
              // TODO: Save changes to the incident
            }}
            className="btn btn-primary"
            disabled={description === incident.description}
          >
            Save changes
          </Button>
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="status">Status</Label>
          <p id="status">{incident.status}</p>
        </div>
      </div>
      <div className="flex flex-col gap-4 items-start">
        <div className="flex flex-col gap-4">
          <Label htmlFor="hitbox">Vehicle Hitbox</Label>
          <VehicleSketchSelector selection={hitbox} />
        </div>
      </div>
    </div>
  );
};

const IncidentParticpants: React.FC<{ incident: Incident }> = ({}) => {
  const avatar = api.clients.avatar.useQuery();

  // TODO: Implement participants list. Right now it's just the user's avatar.

  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="flex flex-row gap-5 items-center">
        <Label htmlFor="participants">Participants</Label>
        <div id="participants" className="flex flex-row gap-2">
          <Avatar className="h-10 w-10 flex items-center justify-center border-2">
            <AvatarFallback>
              <span className="tracking-tighter text-sm">US</span>
            </AvatarFallback>
            <AvatarImage src={avatar.data} className="object-cover" />
          </Avatar>
        </div>
      </div>
    </div>
  );
};

const IncidentPage = () => {
  const { incident } = useParams<{ incident: string }>();

  const incidentQuery = api.clients.loadIncident.useQuery(incident);

  if (incidentQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loading title="Loading incident..." message="Sit tight" />
      </div>
    );
  }

  if (incidentQuery.error || !incidentQuery.data) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <ErrorPanel message="Failed to fetch incident" />
      </div>
    );
  }

  // TODO: Format the incident ID to be more readable

  // format the bids to the bid[] type, from the incidentQuery.data.bid.bids[] type

  return (
    <div className="flex flex-col items-start w-full h-full">
      <div className="h-full w-full px-4 py-6 lg:px-8 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-4xl font-bold tracking-tight ">
              Incident details for {formatString(incidentQuery.data.id, 10)}
            </h1>
            <IncidentParticpants incident={incidentQuery.data} />
          </div>
          <p className="text-muted-foreground">
            Here you can see all the details of the incident.
          </p>
        </div>
        <IncidentView incident={incidentQuery.data} />
        <BiddingPlatform
          status={incidentQuery.data.biddingStatus}
          data={incidentQuery.data.bid || undefined}
          bids={incidentQuery.data.bid?.bids || []}
        />
      </div>
    </div>
  );
};

export default IncidentPage;
