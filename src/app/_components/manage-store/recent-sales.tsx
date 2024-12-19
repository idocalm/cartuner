"use client";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/trpc/react";
import ChangeOrderStatus from "./order-status-combobox";
import ChangeOrderNotes from "./order-notes-change";
import { OrderStatus } from "@prisma/client";
import { useState } from "react";
import ErrorPanel from "../client/shared/error";
import { Sale } from "~/app/types";

interface RecentSalesProps {
  sales: Sale[];
}

const SaleCard: React.FC<{
  sale: Sale;
  updateSaleStatus: ReturnType<typeof api.store.updateSaleStatus.useMutation>;
  updateSaleNotes: ReturnType<typeof api.store.updateSaleNotes.useMutation>;
  isUpdating: boolean;
}> = ({ sale, updateSaleStatus, updateSaleNotes, isUpdating }) => {
  let variant: "default" | "success" | "warning" = "default";

  if (sale.status === OrderStatus.DELIVERED) {
    variant = "success";
  }
  if (sale.status === OrderStatus.CANCELLED) {
    variant = "warning";
  }

  return (
    <Card key={sale.id}>
      <div className={isUpdating ? "blur-xl" : ""}>
        <CardHeader>
          <div className="flex flex-row w-full justify-between items-center gap-3">
            <div className="flex flex-row gap-4">
              <Badge variant={variant}>
                {sale.status.toLocaleLowerCase().charAt(0).toUpperCase() +
                  sale.status.slice(1).toLowerCase()}
              </Badge>
              <CardTitle>Order #{sale.id}</CardTitle>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <ChangeOrderNotes
                currentNote={sale.notes}
                setNote={(notes: string) => {
                  updateSaleNotes.mutate({
                    orderId: sale.realId,
                    notes,
                  });
                }}
              />
              <ChangeOrderStatus
                currentStatus={sale.status}
                setStatus={(status) => {
                  updateSaleStatus.mutate({
                    orderId: sale.realId,
                    status,
                  });
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row w-full justify-between items-center gap-3">
            <div className="flex flex-row gap-4">
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
        </CardContent>
      </div>
    </Card>
  );
};

const RecentSales: React.FC<RecentSalesProps> = ({ sales }) => {
  const [updatingList, setUpdatingList] = useState<string[]>([]);

  const updateSaleStatus = api.store.updateSaleStatus.useMutation({
    onMutate: ({ orderId }) => {
      setUpdatingList((prev) => [...prev, orderId]);
    },
    onSuccess: ({ newStatus, orderId }) => {
      // update the status of the sale in the sales list
      sales.forEach((sale) => {
        if (sale.realId === orderId) {
          sale.status = newStatus;
        }
      });
      setUpdatingList(updatingList.filter((id) => id !== orderId));
    },
  });

  const updateSaleNotes = api.store.updateSaleNotes.useMutation({
    onMutate: ({ orderId }) => {
      setUpdatingList((prev) => [...prev, orderId]);
    },
    onSuccess: ({ notes, orderId }) => {
      // update the notes of the sale in the sales list
      sales.forEach((sale) => {
        if (sale.realId === orderId) {
          sale.notes = notes;
        }
      });
      setUpdatingList(updatingList.filter((id) => id !== orderId));
    },
  });

  if (!sales) {
    return <ErrorPanel message="Failed to fetch recent sales" />;
  }

  if (sales.length === 0) {
    return (
      <div className="text-muted-foreground text-md font-bold tracking-tighter">
        No recent sales
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sales.map((sale) => {
        return (
          <SaleCard
            key={sale.id}
            sale={sale}
            updateSaleNotes={updateSaleNotes}
            updateSaleStatus={updateSaleStatus}
            isUpdating={updatingList.includes(sale.realId)}
          />
        );
      })}
    </div>
  );
};

export default RecentSales;
