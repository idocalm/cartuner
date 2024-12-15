"use client";

import Loading from "~/app/_components/client/shared/loading";
import { api } from "~/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

const StoreStatus: React.FC<{
  status: "Pending for approval" | "Accepted" | "Denied";
}> = ({ status }) => {
  const color = {
    "Pending for approval": "bg-yellow-100 text-yellow-800",
    Accepted: "bg-green-100 text-green-800",
    Denied: "bg-red-100 text-red-500",
  }[status];

  const description = {
    "Pending for approval":
      "We are still reviewing this store and will get back to you in the next 24 hours.",
    Accepted: "This store has been approved and is now live.",
    Denied:
      "This store has been denied. Please contact support at: support@caretuner.dev",
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <span
            className={`px-2 py-1 rounded-md text-xs font-bold tracking-tighter flex justify-center items-center ${color}`}
          >
            {status}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{description[status]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const OwnerDashboard = () => {
  const stores = api.store.fetchByOwner.useQuery();
  const router = useRouter();

  if (stores.isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loading title="Loading data" message="Please wait a few moments" />
      </div>
    );
  }

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here&apos;s a quick glance at the store&apos;s you own.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {stores.data?.map((store) => (
          <Card key={store.id}>
            <CardHeader>
              <CardTitle>
                <div className="w-full flex flex-row justify-between items-center">
                  <p>{store.name}</p>
                  <StoreStatus
                    status={
                      store.publicationStatus as
                        | "Pending for approval"
                        | "Accepted"
                        | "Denied"
                    }
                  />
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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant={"destructive"}>Danger Zone Actions</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        <span className="text-red-500">Danger Zone</span>
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        <div className="flex flex-col gap-4">
                          Actions below are irreversible, and will affect your
                          store. Please proceed with CAUTION.
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-row justify-between items-center">
                              <div className="flex flex-col gap">
                                <span className="font-bold tracking-tighter text-lg">
                                  Delete store
                                </span>
                                <span className="text-muted-foreground text-sm">
                                  Permanentaly delete this store and all its
                                  data from caretuner.
                                </span>
                              </div>
                              <Button variant={"destructive"}>
                                Delete Store
                              </Button>
                            </div>
                            <div className="flex flex-row justify-between items-center">
                              <div className="flex flex-col gap">
                                <span className="font-bold tracking-tighter text-lg">
                                  Change store visibility
                                </span>
                                <span className="text-muted-foreground text-sm">
                                  This store is currently visible to everyone.
                                </span>
                              </div>
                              <Button variant={"destructive"}>
                                Change Visibility
                              </Button>
                            </div>
                            <div className="flex flex-row justify-between items-center">
                              <div className="flex flex-col gap">
                                <span className="font-bold tracking-tighter text-lg">
                                  Transfer store ownership
                                </span>
                                <span className="text-muted-foreground text-sm">
                                  Transfer this store to another user.
                                </span>
                              </div>
                              <Button variant={"destructive"}>
                                Transfer Ownership
                              </Button>
                            </div>
                          </div>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OwnerDashboard;
