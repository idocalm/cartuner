"use client";

import { Timeline } from "~/app/_components/timeline";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { format } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Calendar } from "~/components/ui/calendar";
import { Separator } from "~/components/ui/separator";
import { type Dispatch, type SetStateAction, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import countries from "~/data/countries";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { Icons } from "~/components/ui/icons";
import { useToast } from "~/hooks/use-toast";
import { useAuth } from "~/app/_components/auth-context";
import Cookies from "js-cookie";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";

const PointProcess = () => {
  const data = [
    {
      title: "1.",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 font-normal">
            Design and build your store&apos;s homepage and products, and enter
            some basic information about your store.
          </p>
        </div>
      ),
    },
    {
      title: "2.",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 font-normal">
            Wait for the cartuners to review your application and approve it.
            This process can take up to{" "}
            <span className="font-bold text-greenish">48 hours.</span>
          </p>
        </div>
      ),
    },
    {
      title: "3.",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 font-normal">
            Once your application is approved, you can start accepting orders
            from customers.
          </p>
        </div>
      ),
    },
  ];
  return <Timeline data={data} gap="16" />;
};

interface CreationInterface {
  isOwner: boolean;
  acceptedTerms: boolean;
  setAcceptedTerms: (value: boolean) => void;
  setIsOwner: (value: boolean) => void;
  storeName: string;
  setStoreName: (value: string) => void;
  establishedAt: Date | undefined;
  setEstablishedAt: Dispatch<SetStateAction<Date | undefined>>;
  country: string;
  setCountry: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  postalCode: string;
  setPostalCode: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  storeURL: string;
  setStoreURL: (value: string) => void;
  storePhone: string;
  setStorePhone: (value: string) => void;
}

const StoreCreation: React.FC<CreationInterface> = ({
  isOwner,
  acceptedTerms,
  setAcceptedTerms,
  setIsOwner,
  storeName,
  setStoreName,
  establishedAt,
  setEstablishedAt,
  country,
  setCountry,
  city,
  setCity,
  postalCode,
  setPostalCode,
  address,
  setAddress,
  email,
  setEmail,
  password,
  setPassword,
  storeURL,
  setStoreURL,
  storePhone,
  setStorePhone,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="py-2 flex flex-col gap-3">
      <div className="grid grid-cols-4 items-center justify-start">
        <Label htmlFor="name" className="text-right">
          <div className="flex items-center justify-start flex-row">
            Store name
          </div>
        </Label>
        <Input
          id="name"
          className="col-span-3"
          value={storeName}
          onChange={(e) => {
            setStoreName(e.target.value);
          }}
        />
      </div>
      <div className="grid grid-cols-4 items-center justify-start">
        <Label htmlFor="website" className="text-right">
          <div className="flex items-center justify-start flex-row">
            Store website
          </div>
        </Label>
        <Input
          id="website"
          className="col-span-3"
          value={storeURL}
          onChange={(e) => {
            setStoreURL(e.target.value);
          }}
        />
      </div>
      <div className="grid grid-cols-4 items-center justify-start">
        <Label htmlFor="phone" className="text-right">
          <div className="flex items-center justify-start flex-row">
            Store phone
          </div>
        </Label>
        <Input
          id="phone"
          className="col-span-3"
          value={storePhone}
          onChange={(e) => {
            setStorePhone(e.target.value);
          }}
        />
      </div>

      <div className="grid grid-cols-4 items-center justify-start">
        <Label className="text-right">
          <div className="flex items-center justify-start flex-row">
            Established at
          </div>
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={
                "w-[240px] pl-3 text-left font-normal text-muted-foreground"
              }
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {establishedAt ? (
                format(establishedAt, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
              weekStartsOn={1}
              selected={establishedAt}
              onSelect={setEstablishedAt}
            />
          </PopoverContent>
        </Popover>
      </div>
      <Separator />
      <div className="grid grid-cols-4 items-center justify-start">
        <Label className="text-right">
          <div className="flex items-center justify-start flex-row">
            Country
          </div>
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {country !== ""
                ? countries.find((e) => e.country === country)?.country
                : "Select country..."}

              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search a country..." />
              <CommandList>
                <CommandEmpty>No such country.</CommandEmpty>
                <CommandGroup>
                  {countries.map((e) => (
                    <CommandItem
                      key={e.code}
                      value={e.country}
                      onSelect={(currentValue) => {
                        setCountry(
                          currentValue === country ? "" : currentValue
                        );
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          country === e.code ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {e.country}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid grid-cols-4 items-center justify-start">
        <Label htmlFor="city" className="text-right">
          <div className="flex items-center justify-start flex-row">City</div>
        </Label>
        <Input
          id="city"
          className="col-span-3"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
          }}
        />
      </div>
      <div className="grid grid-cols-4 items-center justify-start">
        <Label htmlFor="postal" className="text-right">
          <div className="flex items-center justify-start flex-row">
            Postal Code
          </div>
        </Label>
        <Input
          id="postal"
          value={postalCode}
          className="col-span-3"
          onChange={(e) => {
            setPostalCode(e.target.value);
          }}
        />
      </div>
      <div className="grid grid-cols-4 items-center justify-start">
        <Label htmlFor="address" className="text-right">
          <div className="flex items-center justify-start flex-row">
            Address
          </div>
        </Label>
        <Input
          id="address"
          className="col-span-3"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
          }}
        />
      </div>
      <Separator />
      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={acceptedTerms}
          onCheckedChange={(value: boolean) => {
            setAcceptedTerms(value);
          }}
        />
        <Label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I accept the terms and conditions.
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="owner"
          checked={isOwner}
          onCheckedChange={(value: boolean) => {
            setIsOwner(value);
          }}
        />
        <Label
          htmlFor="owner"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I am the owner of this store and have the right to sell its products.
        </Label>
      </div>

      <Separator />
      {isOwner && (
        <>
          <p className="text-lg font-semibold leading-none text-white tracking-tight">
            Admin account
          </p>
          <div className="mt-2 grid grid-cols-4 items-center justify-start">
            <Label htmlFor="email" className="text-right">
              <div className="flex items-center justify-start flex-row">
                Email
              </div>
            </Label>
            <Input
              id="email"
              className="col-span-3"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center justify-start">
            <Label htmlFor="password" className="text-right">
              <div className="flex items-center justify-start flex-row">
                Password
              </div>
            </Label>
            <Input
              id="password"
              type="password"
              className="col-span-3"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

const SignUpPage = () => {
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [storeName, setStoreName] = useState<string>("");
  const [storeURL, setStoreURL] = useState<string>("");
  const [establishedAt, setEstablishedAt] = useState<Date>();
  const [country, setCountry] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [created, setCreated] = useState<boolean>(false);
  const [storeId, setStoreId] = useState<string>("");
  const router = useRouter();

  const { toast } = useToast();
  const { setToken } = useAuth();

  const submit = api.mechanics.createStore.useMutation({
    onError: (error) => {
      setIsLoading(false);
      toast({
        title: "Failed to create store",
        description: error.message,
        variant: "destructive",
        duration: 3000,
      });
    },
    onSuccess: ({ store, token }) => {
      Cookies.set("auth-token", token);
      setToken(token);

      setIsLoading(false);
      setCreated(true);
      setStoreId(store.id);
      toast({
        title: "Store created",
        description: "Your store has been created successfully.",
        duration: 2000,
      });
    },
  });

  if (created) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen">
        <Confetti />
        <h1 className="text-6xl font-black tracking-tighter text-center">
          Your store has been created
        </h1>
        <p className="text-center text-muted-foreground">
          In the next <span className="text-greenish">48 hours</span>, we will
          approve your store and you can start accepting orders! 🎉
        </p>

        <br />

        <p className="text-center text-muted-foreground">
          You can checkup on your store&apos;s status by visiting{" "}
          <span className="text-greenish">/store/{storeId}</span>. or by
          clicking the button below.
        </p>
        <br />
        <Button
          variant="outline"
          onClick={() => {
            router.push(`/store/${storeId}`);
          }}
        >
          What&apos;s up with my store?
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-14 items-center h-screen w-screen p-28">
      <div className="flex w-full flex-col">
        <h1 className="text-4xl font-bold tracking-tighter text-center">
          Welcome to the <span className="text-greenish">cartuners</span>{" "}
          family!
        </h1>
        <p className="text-center text-muted-foreground">
          What is the process of signing up as a mechanic?
        </p>
        <PointProcess />
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Let&apos;s get started</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new store</DialogTitle>
            <DialogDescription>
              <StoreCreation
                isOwner={isOwner}
                acceptedTerms={acceptedTerms}
                setAcceptedTerms={setAcceptedTerms}
                setIsOwner={setIsOwner}
                setStoreName={setStoreName}
                setStoreURL={setStoreURL}
                setEstablishedAt={setEstablishedAt}
                setCountry={setCountry}
                setCity={setCity}
                setPostalCode={setPostalCode}
                setAddress={setAddress}
                storeName={storeName}
                establishedAt={establishedAt}
                country={country}
                city={city}
                postalCode={postalCode}
                address={address}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                storeURL={storeURL}
                setStorePhone={setPhone}
                storePhone={phone}
              />
            </DialogDescription>
            <DialogFooter>
              <Button
                variant="default"
                disabled={!acceptedTerms || !isOwner || isLoading}
                onClick={() => {
                  setIsLoading(true);
                  const est = establishedAt ? establishedAt : new Date();
                  submit.mutate({
                    name: storeName,
                    establishedAt: est,
                    country,
                    city,
                    postalCode,
                    address,
                    email,
                    password,
                    url: storeURL,
                    phone,
                  });
                }}
              >
                {isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <></>
                )}
                Continue
              </Button>
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <a
        className="text-center text-muted-foreground font-bold tracking-tighter"
        href="/auth/mechanic/signin"
      >
        Already have an account? Sign in.
      </a>
    </div>
  );
};

export default SignUpPage;
