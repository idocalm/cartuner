"use client";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";

interface RecentSalesProps {
  storeId: string;
}

const RecentSales: React.FC<RecentSalesProps> = ({ storeId }) => {
  const sales = api.store.fetchSales.useQuery(storeId);

  if (sales.isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!sales.data) {
    return (
      <div className="text-muted-foreground text-sm">
        Error loading recent sales
      </div>
    );
  }

  if (sales.data.length === 0) {
    return (
      <div className="text-muted-foreground text-md font-bold tracking-tighter">
        No recent sales
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sales.data.map((sale) => {
        return (
          <div
            key={sale.id}
            className="flex flex-row items-center justify-between"
          >
            <div className="flex flex-row items-center gap-3">
              <Avatar>
                <AvatarImage src={sale.customer?.avatar} />
                <AvatarFallback>{sale.customer?.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">{sale.customer?.name}</div>
                <div className="text-xs text-muted-foreground">
                  {sale.customer?.email}
                </div>
              </div>
            </div>
            <div className="text-sm font-medium">${sale.total}</div>
          </div>
        );
      })}
    </div>
  );
};

export default RecentSales;
