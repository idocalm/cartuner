"use client";

import { columns } from "~/app/_components/admin/columns";
import { useEffect, useState } from "react";

import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";
import DataTable from "~/app/_components/admin/data-table";

const AdminDashboard = () => {
  const storeRequests = api.admin.storeRequests.useQuery();
  const { toast } = useToast();

  const storeApprove = api.admin.approveStore.useMutation({
    onSuccess: () => {
      storeRequests.refetch();
      toast({
        title: "Store approved",
        description: "This store has been approved and is now live.",
        duration: 2000,
      });
    },
  });

  const storeDeny = api.admin.denyStore.useMutation({
    onSuccess: () => {
      storeRequests.refetch();
      toast({
        title: "Vehicle deleted",
        description: "The vehicle has been deleted from your garage.",
        duration: 2000,
      });
    },
  });

  const [data, setData] = useState<
    {
      id: string;
      title: string;
      status: string;
      label: string;
      priority: string;
      approved: () => void;
      denied: () => void;
    }[]
  >([]);

  useEffect(() => {
    setData([]);
    if (storeRequests.status === "success" && storeRequests.data) {
      for (const store of storeRequests.data) {
        const dateDiff =
          new Date().getTime() - new Date(store.createdAt).getTime();
        const diffHours = Math.floor(dateDiff / (1000 * 60 * 60));
        let priority = "low";
        if (diffHours > 24) {
          priority = "high";
        }

        let status = "todo";
        if (store.publicationStatus === "Accepted") {
          status = "accepted";
        }
        if (store.publicationStatus === "Denied") {
          status = "denied";
        }

        const approved = () => {
          storeApprove.mutate(store.id);
        };

        const denied = () => {
          storeDeny.mutate(store.id);
        };

        setData((prev) => [
          ...prev,
          {
            id: store.id,
            title: store.name,
            status,
            label: "store_request",
            priority,
            approved,
            denied,
          },
        ]);
      }
    }
  }, [storeRequests.status]);

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here&apos;s a quick overview of what&apos;s happening.
          </p>
        </div>
      </div>
      <DataTable data={data} columns={columns} />
    </div>
  );
};

export default AdminDashboard;
