"use client";
import { useParams } from "next/navigation";

import ErrorPanel from "~/app/_components/client/shared/error";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { Camera, Pen, TriangleAlertIcon } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { Input } from "~/components/ui/input";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import React, { useState } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { useRouter } from "next/navigation";

const EditStoreName: React.FC<{
  saveName: (name: string) => void;
  show: boolean;
}> = ({ saveName, show }) => {
  const [name, setName] = useState("");

  if (!show) {
    return <> </>;
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Pen size={24} className="cursor-pointer" />
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Change store name</DrawerTitle>
            <DrawerDescription>Enter your new name below</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <Input
                placeholder="Enter new name"
                className="w-full"
                defaultValue="My Store"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button
                onClick={() => {
                  saveName(name);
                }}
              >
                Submit
              </Button>
            </DrawerClose>

            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const EditCamera: React.FC<{
  saveImage: (image: string) => void;
  show: boolean;
}> = ({ saveImage, show }) => {
  const [image, setImage] = useState("");

  if (!show) {
    return <> </>;
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Camera size={24} className="absolute left-4 top-4 cursor-pointer" />
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Change store thumbnail</DrawerTitle>
            <DrawerDescription>
              Enter your new image URL below
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <Input
                placeholder="Enter new image URL"
                className="w-full"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button
                onClick={() => {
                  saveImage(image);
                }}
              >
                Submit
              </Button>
            </DrawerClose>

            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const StorePage = () => {
  const { store } = useParams<{ store: string }>();

  const storeQuery = api.store.fetch.useQuery(store);
  const ownerId = storeQuery.data?.ownerId;
  const currentUserId = api.auth.getId.useQuery();

  const updateName = api.store.updateName.useMutation({
    onSuccess: () => {
      storeQuery.refetch();
    },
  });

  const updateImage = api.store.updateImage.useMutation({
    onSuccess: () => {
      storeQuery.refetch();
    },
  });

  const router = useRouter();

  if (storeQuery.error) {
    return <ErrorPanel message={storeQuery.error.message} />;
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

  if (storeQuery.data?.publicationStatus == "Denied") {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Card className="w-[350px]">
          <CardContent>
            <div className="flex flex-col space-y-4 w-full items-center p-16">
              <TriangleAlertIcon size={80} className="text-red-500" />
              <p className="text-center text-lg font-semibold tracking-tighter">
                Your store has been denied
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formattedTime = storeQuery.data?.establishedAt.toLocaleDateString();

  return (
    <div className="h-screen w-screen flex flex-col">
      <div>
        {storeQuery.data && (
          <>
            <img
              src={storeQuery.data.image}
              alt="Store logo"
              className="w-full h-60 object-cover"
            />
            <EditCamera
              show={currentUserId.data === ownerId}
              saveImage={(image: string) => {
                updateImage.mutate({ id: storeQuery.data!.id, image });
              }}
            />
          </>
        )}
      </div>
      <div className="flex flex-col h-screen w-screen pb-16 pt-10 px-16 gap-4">
        <div className="flex flex-row justify-between w-full items-center z-10">
          {storeQuery.isLoading ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-48" />
            </div>
          ) : (
            <>
              <h1 className="text-6xl font-bold tracking-tighter text-center ">
                {storeQuery.data?.name}
              </h1>
              <div className="flex flex-row gap-3 items-center">
                {storeQuery.data?.ownerId === currentUserId.data && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      router.push(`/store/${store}/manage`);
                    }}
                  >
                    Manage
                  </Button>
                )}
                <EditStoreName
                  show={currentUserId.data === ownerId}
                  saveName={(name) => {
                    updateName.mutate({ id: storeQuery.data!.id, name });
                  }}
                />
              </div>
            </>
          )}
        </div>
        <Separator />
        <div className="flex flex-col justify-between w-full">
          {storeQuery.isLoading ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ) : (
            <div className="flex flex-row justify-between w-full items-center">
              <p className="text-lg font-semibold tracking-tighter">
                Located at {storeQuery.data?.country}, {storeQuery.data?.city},{" "}
                {storeQuery.data?.address}
              </p>
              <p className="text-md font-medium tracking-tighter text-muted-foreground">
                Est. {formattedTime}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StorePage;
