"use client";

import { Button } from "~/components/ui/button";

import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { CalendarDateRangePicker } from "~/app/_components/manage-store/date-picker";
import { MainNav } from "~/app/_components/manage-store/main-nav";
import UserNav from "~/app/_components/manage-store/user-nav";
import OverviewFragment from "~/app/_components/manage-store/fragments/overview";
import React from "react";
import { useParams } from "next/navigation";

const ManageStore: React.FC = () => {
  const { store } = useParams<{ store: string }>();
  return (
    <div className="hidden flex-col md:flex">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav storeId={store} />
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
