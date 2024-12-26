"use client";
import { useParams } from "next/navigation";

import ErrorPanel from "~/app/_components/client/shared/error";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import {
  Camera,
  Pen,
  ShoppingBag,
  Star,
  TriangleAlertIcon,
} from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { Input } from "~/components/ui/input";
import useCart from "~/hooks/use-cart";
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
import React, { useEffect, useState } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { useRouter } from "next/navigation";
import ProductsView from "~/app/_components/manage-store/products-view";
import { toast } from "sonner";
import type { Product } from "@prisma/client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import Cart from "~/app/_components/store/cart";
import ReviewsView from "~/app/_components/store/reviews-view";
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
import { Textarea } from "~/components/ui/textarea";
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

const ReviewDialog: React.FC<{
  name: string;
  onPublish: (title: string, description: string, stars: number) => void;
}> = ({ name, onPublish }) => {
  const [stars, setStars] = useState(0);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Write a review</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Review {name}</AlertDialogTitle>
          <AlertDialogDescription>
            Please avoid writing hateful or inappropriate content. Keep it
            professional!
          </AlertDialogDescription>
          <Separator />
          <Input
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <Textarea
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
          <Separator />
          <div className="flex flex-col gap-4">
            <p className="text-sm">Overall, I&apos;d mark this store as a:</p>
            <div className="flex flex-row gap-4 w-full items-center justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Button
                  variant="outline"
                  key={i}
                  onClick={() => setStars(i + 1)}
                  className={i < stars ? "text-greenish" : ""}
                >
                  <Star />
                </Button>
              ))}
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onPublish(title, description, stars);
            }}
          >
            Publish
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const StorePage = () => {
  const { store } = useParams<{ store: string }>();

  const storeQuery = api.store.fetch.useQuery(store);

  const ownerId = storeQuery.data?.ownerId;
  const currentUserId = api.auth.getId.useQuery();
  const products = api.store.getProducts.useQuery(store);
  const [cartOpen, setCartOpen] = useState(false);

  const updateName = api.store.updateName.useMutation({
    onSuccess: () => {
      storeQuery.refetch();
    },
  });

  const addReview = api.store.addReview.useMutation({
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
  const formattedTime = storeQuery.data?.establishedAt.toLocaleDateString();
  const cart = useCart();

  useEffect(() => {
    cart.load();
  }, []);

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
                Store is pending for approval
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
                Store has been denied.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col">
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Your cart</SheetTitle>
            <SheetDescription>
              Here are the items you&apos;ve added to your cart
            </SheetDescription>
          </SheetHeader>
          <br />
          <Cart />
        </SheetContent>
      </Sheet>
      <div className="absolute right-5 top-5">
        <Button
          variant="outline"
          disabled={cartOpen}
          onClick={() => {
            setCartOpen(true);
          }}
        >
          <ShoppingBag className="w-5" />
        </Button>
      </div>

      {storeQuery.data && (
        <div className="absolute left-5 top-5">
          <Button
            variant="outline"
            onClick={() => {
              router.back();
            }}
          >
            Back
          </Button>
        </div>
      )}
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

        <Separator />
        <div className="flex flex-col gap-4 items-start">
          <h1 className="text-4xl font-bold tracking-tighter text-center ">
            Products
          </h1>
          {storeQuery.isLoading ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-48" />
            </div>
          ) : (
            <ProductsView
              products={products.data || []}
              filter=""
              isOwner={ownerId === currentUserId.data}
              requestRefresh={() => {
                products.refetch();
              }}
              addToCart={(product: Product) => {
                cart.add(product);
                toast("Product added to cart", {
                  description: `1 '${product.name}' added to cart`,
                  action: {
                    label: "Undo",
                    onClick: () => {
                      cart.remove(product.id);
                      toast("Product removed from cart", {
                        description: `1 '${product.name}' removed from your cart`,
                      });
                    },
                  },
                });
              }}
            />
          )}
        </div>

        <Separator />
        <div className="flex flex-col gap-4 items-start">
          <div className="flex flex-row justify-between w-full items-center">
            <h1 className="text-4xl font-bold tracking-tighter text-center ">
              Reviews
            </h1>
            <ReviewDialog
              name={storeQuery.data?.name || ""}
              onPublish={(
                title: string,
                description: string,
                stars: number
              ) => {
                addReview.mutate({
                  storeId: storeQuery.data!.id,
                  title,
                  description,
                  stars,
                });
              }}
            />
          </div>
          {storeQuery.isLoading ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-48" />
            </div>
          ) : (
            <ReviewsView reviews={storeQuery.data?.reviews || []} />
          )}
        </div>
      </div>
    </div>
  );
};

export default StorePage;
