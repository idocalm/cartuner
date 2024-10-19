"use client";

import { Button } from "~/components/ui/button";

import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { CalendarDateRangePicker } from "~/app/_components/manage-store/date-picker";
import { MainNav } from "~/app/_components/manage-store/main-nav";
import UserNav from "~/app/_components/manage-store/user-nav";
import OverviewFragment from "~/app/_components/manage-store/fragments/overview";
import React from "react";
import { useParams } from "next/navigation";
import MechanicList from "~/app/_components/manage-store/mechanic-list";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { useState } from "react";
import { api } from "~/trpc/react";
import Loading from "~/app/_components/client/shared/loading";
import { StoreOwnerUser } from "@prisma/client";
import ErorrPanel from "~/app/_components/client/shared/error";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

const ManageStore: React.FC = () => {
  const { store } = useParams<{ store: string }>();
  const [manageMechanicsOpen, setManageMechanicsOpen] = useState(false);

  const owner = api.store.getOwner.useQuery(store);
  const mechanics = api.store.getMechanics.useQuery(store);

  const showMechanicDialog = () => {
    mechanics.refetch();

    setManageMechanicsOpen(true);
  };

  if (owner.isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loading title="Loading store" message="Please wait a few moments" />
      </div>
    );
  }

  if (owner.error) {
    return <ErorrPanel message={owner.error.message} />;
  }

  return (
    <div className="hidden flex-col md:flex">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav
              owner={owner.data as StoreOwnerUser}
              showManageMechanics={() => showMechanicDialog()}
            />
            <AlertDialog
              open={manageMechanicsOpen}
              onOpenChange={setManageMechanicsOpen}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Manage store personnal</AlertDialogTitle>
                  <AlertDialogDescription>
                    {mechanics.isLoading && (
                      <Loading
                        title="Loading mechanics"
                        message="Please wait a few moments"
                      />
                    )}

                    {mechanics.data && (
                      <>
                        Click the New button to add a new mechanic to your
                        store. You can also remove or edit existing mechanics.
                        <MechanicList
                          mechanics={mechanics.data}
                          store={store}
                        />
                      </>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button>New</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      To add a new mechanic, use the{" "}
                      <span className="font-bold text-greenish tracking-tighter">
                        invite
                      </span>{" "}
                      link:
                      <input
                        type="text"
                        className="w-full p-2 my-2 border border-gray-300 rounded"
                        value="https://example.com/invite"
                        readOnly
                      />
                    </PopoverContent>
                  </Popover>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <CalendarDateRangePicker />
            <Button>Download</Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <OverviewFragment />
        </Tabs>
      </div>
    </div>
  );
};

export default ManageStore;
