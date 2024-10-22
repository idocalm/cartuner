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
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { useState } from "react";
import { api } from "~/trpc/react";
import Loading from "~/app/_components/client/shared/loading";
import { type MechanicUser, StoreOwnerUser } from "@prisma/client";
import ErrorPanel from "~/app/_components/client/shared/error";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Icons } from "~/components/ui/icons";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { Input } from "~/components/ui/input";
import ProductsView from "~/app/_components/manage-store/products-view";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import categories from "~/data/tuners-categories";
import { cn } from "~/lib/utils";

const InviteMechanicDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMechanicDelete: (id: string) => void;
  mechanics: MechanicUser[];
  store: string;
}> = ({ open, onOpenChange, mechanics, store, onMechanicDelete }) => {
  const [showInvite, setShowInvite] = useState(false);
  const [inviteCode, setInviteCode] = useState("");

  const inviteRequest = api.store.requestInvite.useMutation({
    onSuccess: (code: string) => {
      setInviteCode(code);
      setShowInvite(true);
    },
  });

  const requestInvite = () => {
    inviteRequest.mutate(store);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Manage store personnal</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex flex-col gap-4">
              Click the New button to add a new mechanic to your store. You can
              also remove or edit existing mechanics.
              <MechanicList
                mechanics={mechanics}
                deleteMechanic={onMechanicDelete}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            onClick={() => requestInvite()}
            disabled={inviteRequest.isPending}
          >
            {inviteRequest.isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            New
          </Button>
          <Popover open={showInvite} onOpenChange={setShowInvite}>
            <PopoverTrigger></PopoverTrigger>
            <PopoverContent>
              To add a new mechanic, use the{" "}
              <span className="font-bold text-greenish tracking-tighter">
                invite
              </span>{" "}
              link:
              <input
                type="text"
                className="w-full p-2 my-2 border border-gray-300 rounded"
                value={"/invite/" + inviteCode}
                readOnly
              />
              <p className="text-sm text-gray-500">
                This link will allow the user to create an account and
                automatically join your store. Do{" "}
                <span className="font-bold">not</span> share this link. It will
                expire in <span className="font-bold">5 minutes</span>.
              </p>
            </PopoverContent>
          </Popover>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const OverviewPanel: React.FC = () => {
  return (
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
  );
};

const ProductsPanel: React.FC<{ store: string }> = ({ store }) => {
  const products = api.store.getProducts.useQuery(store);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState<number>(0);
  const [productImage, setProductImage] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productDescription, setProductDescription] = useState("");

  const createProduct = api.store.createProduct.useMutation({
    onSuccess: () => {
      setLoading(false);
      setOpen(false);
      products.refetch();
    },
  });

  if (products.isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loading title="Loading products" message="Please wait a few moments" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <div className="flex items-center space-x-2">
          <Input placeholder="Search products" />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>
                <Plus size={24} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Create a new product</AlertDialogTitle>
                <AlertDialogDescription>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                      Click the Confirm button to create a new product.
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-row gap-4 items-center">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          placeholder="Product name"
                          value={productName}
                          onChange={(e) => {
                            setProductName(e.target.value);
                          }}
                        />
                      </div>
                      <div className="flex flex-row gap-4 items-center">
                        <Label htmlFor="price">Price</Label>
                        <Input
                          id="price"
                          placeholder="Product price"
                          value={productPrice}
                          onChange={(e) => {
                            setProductPrice(parseFloat(e.target.value));
                          }}
                        />
                      </div>
                      <div className="flex flex-row gap-4 items-center">
                        <Label htmlFor="image">Image</Label>
                        <Input
                          id="image"
                          placeholder="Product image URL"
                          value={productImage}
                          onChange={(e) => {
                            setProductImage(e.target.value);
                          }}
                        />
                      </div>
                      <div className="flex flex-row gap-4 items-center">
                        <Label htmlFor="category">Category</Label>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className="w-[200px] justify-between"
                            >
                              {productCategory
                                ? categories.find(
                                    (category) =>
                                      category.text === productCategory
                                  )?.text
                                : "Select category..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput placeholder="Search categories..." />
                              <CommandList>
                                <CommandEmpty>
                                  No categories found...
                                </CommandEmpty>
                                <CommandGroup>
                                  {categories.map((category) => (
                                    <CommandItem
                                      key={category.text}
                                      value={category.text}
                                      onSelect={(currentValue) => {
                                        setProductCategory(
                                          currentValue === productCategory
                                            ? ""
                                            : currentValue
                                        );
                                        setOpen(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          productCategory === category.text
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {category.text}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        value={productDescription}
                        onChange={(e) => {
                          setProductDescription(e.target.value);
                        }}
                        id="description"
                        placeholder="Product description"
                      />
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <Button
                  disabled={loading}
                  onClick={() => {
                    setLoading(true);
                    createProduct.mutate({
                      name: productName,
                      price: productPrice,
                      image: productImage,
                      category: productCategory,
                      description: productDescription,
                      storeId: store,
                    });
                  }}
                >
                  {loading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Create
                </Button>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <ProductsView products={products.data ?? []} />
    </div>
  );
};

const ManageStore: React.FC = () => {
  const { store } = useParams<{ store: string }>();
  const [manageMechanicsOpen, setManageMechanicsOpen] = useState(false);
  const [panelName, setPanelName] = useState<
    "overview" | "customers" | "products" | "settings"
  >("overview");

  const panels: Record<
    "overview" | "customers" | "products" | "settings",
    JSX.Element
  > = {
    overview: <OverviewPanel />,
    customers: <></>,
    products: <ProductsPanel store={store} />,
    settings: <></>,
  };

  const owner = api.store.getOwner.useQuery(store);
  const mechanics = api.store.getMechanics.useQuery(store);
  const mechanicDeletion = api.store.deleteMechanic.useMutation({
    onSuccess: () => {
      mechanics.refetch();
    },
  });

  const deleteMechanic = (id: string) => {
    mechanicDeletion.mutate(id);
  };

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
    return <ErrorPanel message={owner.error.message} />;
  }

  return (
    <div className="hidden flex-col md:flex">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav
            className="mx-6"
            store={store}
            selected={panelName}
            onSelected={(
              value: "overview" | "customers" | "products" | "settings"
            ) => {
              console.log(value);
              setPanelName(value);
            }}
          />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav
              owner={owner.data as StoreOwnerUser}
              showManageMechanics={() => showMechanicDialog()}
            />
            <InviteMechanicDialog
              open={manageMechanicsOpen}
              onOpenChange={setManageMechanicsOpen}
              mechanics={mechanics.data ?? []}
              store={store}
              onMechanicDelete={deleteMechanic}
            />
          </div>
        </div>
      </div>
      {panels[panelName]}
    </div>
  );
};

export default ManageStore;
