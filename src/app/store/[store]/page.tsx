"use client";
import { useParams } from "next/navigation";

import ErorrPanel from "~/app/_components/client/shared/error";
import Loading from "~/app/_components/client/shared/loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { TriangleAlertIcon } from "lucide-react";

const StorePage = () => {
  const { store } = useParams<{ store: string }>();

  const storeQuery = api.store.fetch.useQuery(store);

  if (storeQuery.isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loading
          title="Loading store"
          message="Please wait while we load some information"
        />
      </div>
    );
  }

  if (storeQuery.error) {
    return <ErorrPanel message={storeQuery.error.message} />;
  }

  if (storeQuery.data?.publicationStatus == "Pending for approval") {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Card className="w-[350px]">
          <CardContent>
            <div className="flex flex-col space-y-4 w-full items-center p-16">
              <TriangleAlertIcon size={80} />
              <p className="text-center text-lg font-semibold tracking-tighter">
                Your store is pending for approval
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1>Store Page - ID {store}</h1>
    </div>
  );
};

export default StorePage;
