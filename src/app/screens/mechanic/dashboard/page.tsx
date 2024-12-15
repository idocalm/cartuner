"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Loading from "~/app/_components/client/shared/loading";
import { getGreeting } from "~/lib/utils";
import { Store } from "@prisma/client";
import { Separator } from "~/components/ui/separator";

const MechanicDashboard = () => {
  const stores = api.store.fetchByMechanic.useQuery();
  const mechanic = api.clients.name.useQuery();
  const router = useRouter();

  if (stores.isLoading || mechanic.isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loading title="Loading data" message="Please wait a few moments" />
      </div>
    );
  }

  return (
    <div className="hidden h-full flex-1 flex-col gap-16 p-8 md:flex">
      <div className="flex flex-col ">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome back, {mechanic.data}!
          </h2>
          <p className="text-muted-foreground">{getGreeting()}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Stores you work with
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s a quick glance at the store&apos;s you work with.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {stores.data?.map((store: Store) => (
            <Card key={store.id}>
              <CardHeader>
                <CardTitle>
                  <div className="w-full flex flex-row justify-between items-center">
                    <p>{store.name}</p>
                  </div>
                </CardTitle>
                <CardDescription>{store.phone}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Est. {store.establishedAt.toDateString()}
                </p>
                <p className="text-muted-foreground">
                  {store.address}, {store.city}, {store.country}
                </p>
              </CardContent>
              <CardFooter>
                <div className="flex flex-row gap-4">
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      router.push(`/store/${store.id}`);
                    }}
                  >
                    View Store
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Your recent cases
          </h1>
          <p className="text-muted-foreground">
            Incidents, repairs, and other cases you&apos;ve worked on.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <h1 className="text-3xl font-bold tracking-tight">TODO</h1>
        </div>
      </div>
    </div>
  );
};

export default MechanicDashboard;
