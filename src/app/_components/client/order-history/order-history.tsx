import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Timeline } from "../../timeline";
import { Button } from "~/components/ui/button";
import { OrderStatus, Product } from "@prisma/client";
import { api } from "~/trpc/react";
import ErrorPanel from "../shared/error";
import Loading from "../shared/loading";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { toast } from "~/hooks/use-toast";
const OrderStatusPanel: React.FC<{
  status: OrderStatus;
}> = ({ status }) => {
  const data = [
    {
      title: "",
      content: (
        <p className="text-neutral-800 dark:text-neutral-200 font-normal">
          Order placed
        </p>
      ),
    },
    {
      title: "",
      content: (
        <p className="text-neutral-800 dark:text-neutral-200 font-normal">
          Order processed
        </p>
      ),
    },
    {
      title: "",
      content: (
        <p className="text-neutral-800 dark:text-neutral-200 font-normal">
          Order shipped
        </p>
      ),
    },
    {
      title: "",
      content: (
        <p className="text-neutral-800 dark:text-neutral-200 font-normal">
          Order delivered
        </p>
      ),
    },
  ];

  const index = Object.values(OrderStatus).indexOf(status);
  const reduced = data.slice(0, index + 1);

  return <Timeline data={reduced} gap="4" />;
};

const OrderSummary: React.FC<{
  products: Product[];
}> = ({ products }) => {
  const reduced = products.length > 3 ? products.slice(0, 3) : products;
  return (
    <div className="flex flex-col justify-between w-full h-full gap-2">
      <div className="flex flex-col gap-2">
        {reduced.map((item, index) => (
          <div
            key={index}
            className="flex flex-row justify-between w-full items-center"
          >
            <p className="text-sm tracking-tight">{item.name}</p>
            <p className="text-lg font-semibold">${item.price}</p>
          </div>
        ))}

        {products.length > 3 && (
          <p className="text-muted-foreground">+{products.length - 3} more</p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <Separator />
        <div className="flex flex-row justify-between">
          <p className="text-lg tracking-tight">Total</p>
          <p className="text-lg font-semibold">
            ${products.reduce((acc, item) => acc + item.price, 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

const OrderNotes: React.FC<{
  notes: string;
}> = ({ notes }) => {
  return (
    <div className="flex flex-col w-full gap-1">
      <p className="text-lg font-semibold">Notes from the seller</p>
      <p className="text-md text-muted-foreground">{notes}</p>
    </div>
  );
};

interface OrderCardProps {
  orderId: string;
  orderDate: Date;
  products: Product[];
  status: OrderStatus;
  notes: string;
  phoneNumber: string;
  deleteOrder: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  orderId,
  orderDate,
  products,
  notes,
  status,
  phoneNumber,
  deleteOrder,
}) => {
  const [deleteOrderOpen, setDeleteOrderOpen] = useState(false);
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="w-full flex flex-row justify-between items-center">
            <p>Order #{orderId}</p>
            <AlertDialog
              open={deleteOrderOpen}
              onOpenChange={setDeleteOrderOpen}
            >
              <AlertDialogTrigger asChild>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        onClick={() => setDeleteOrderOpen(true)}
                        variant="destructive"
                        disabled={status !== OrderStatus.PLACED}
                      >
                        <Trash size={24} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {status !== OrderStatus.PLACED
                        ? "You can't delete an order that has been already processed."
                        : "Delete order"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete order</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Please make sure you check the
                    refund policy with the seller before proceeding.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      deleteOrder();
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardTitle>
        <CardDescription>
          Order placed on {orderDate.toDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        <div className="flex flex-row w-full pb-8">
          <div className="flex flex-col gap-1 h-full w-1/2">
            <OrderStatusPanel status={status} />
          </div>
          <div className="flex flex-row gap-4 h-full items-start w-1/2 ml-4">
            <Separator orientation="vertical" />
            <OrderSummary products={products} />
          </div>
        </div>
        <OrderNotes notes={notes} />
        <div className="flex flex-row w-full justify-start my-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <a
                  href="#"
                  className="text-primary-500 underline underline-offset-1"
                >
                  Contact seller
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>You can reach us at {phoneNumber}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
};

const OrderHistory: React.FC = () => {
  const orders = api.clients.getOrders.useQuery();

  const removeOrder = api.store.deleteOrder.useMutation({
    onSuccess: () => {
      toast({
        title: "Order deleted",
        description: "The order has been successfully deleted",
      });
      orders.refetch();
    },
  });

  if (orders.isLoading) {
    return <Loading title="Loading orders..." message="Sit tight" />;
  }

  if (orders.error || !orders.data) {
    return <ErrorPanel message="Failed to fetch orders" />;
  }

  if (orders.data.length === 0) {
    return (
      <div className="flex flex-col h-full w-full">
        <div className="col-span-3 lg:col-span-4 lg:border-l">
          <div className="h-full px-4 py-6 lg:px-8 flex flex-col gap-2">
            <div className="flex flex-col gap-1 mb-4">
              <h1 className="text-4xl font-bold tracking-tight ">
                Recent orders
              </h1>
              <p className="text-muted-foreground">
                Here you can see all your recent orders, and their status.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center w-full h-full">
              <p className="text-md text-bold text-muted-foreground">
                You don't have any orders yet
              </p>
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
            <h1 className="text-4xl font-bold tracking-tight ">
              Recent orders
            </h1>
            <p className="text-muted-foreground">
              Here you can see all your recent orders, and their status.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {orders.data.map((order) => (
              <OrderCard
                key={order?.id}
                orderId={order?.id ?? ""}
                orderDate={order?.createdAt ?? new Date()}
                notes={order?.notes ?? ""}
                products={order?.products ?? []}
                status={order?.status ?? OrderStatus.PLACED}
                phoneNumber={order?.store?.phone ?? ""}
                deleteOrder={() => {
                  removeOrder.mutate(order?.realId ?? "");
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
