import { Search } from "lucide-react";
import React, { useEffect } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Icons } from "~/components/ui/icons";
import { useState } from "react";
import type { Store } from "@prisma/client";
import { api } from "~/trpc/react";
import SearchResults from "./search-results";
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

const MapModeSearch = () => {
  const [userLat, setUserLat] = useState<number>(0);
  const [userLng, setUserLng] = useState<number>(0);

  useEffect(() => {
    console.log("Getting user location");
    if (navigator.geolocation) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted" || result.state === "prompt") {
          navigator.geolocation.getCurrentPosition((position) => {
            console.log(position.coords.latitude, position.coords.longitude);

            setUserLat(position.coords.latitude);
            setUserLng(position.coords.longitude);
          }, console.error);
        }
      });
    }
  }, []);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="relative" variant="outline">
          <div className="flex flex-row items-center gap-2">
            <span className="text-sm font-black text-greenish">NEW</span>
            <p className="text-sm font-bold">Map mode</p>
          </div>
          <span className="absolute top-0 left-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-greenish opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-greenish"></span>
          </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[800px]">
        <AlertDialogHeader>
          <AlertDialogTitle>See cartuners near you</AlertDialogTitle>
          <AlertDialogDescription>
            Find tuning stores near you by using the map mode.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <APIProvider apiKey={"AIzaSyAktzv0JWQEQvMRredhbEHXW9XiuD4cOGA"}>
          <Map
            style={{ width: "450px", height: "450px" }}
            defaultCenter={{ lat: userLat, lng: userLng }}
            defaultZoom={4}
            gestureHandling={"auto"}
            disableDefaultUI={false}
          />
        </APIProvider>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const CartunersExplore = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);

  const [nameQuery, setNameQuery] = useState<string>("");
  const [cityQuery, setCityQuery] = useState<string>("");
  const [countryQuery, setCountryQuery] = useState<string>("");

  const search = api.store.search.useMutation({
    onSuccess: (data) => {
      setStores(data);
      setCityQuery("");
      setNameQuery("");
      setCountryQuery("");

      setIsSearching(false);
    },
    onError: () => {
      setIsSearching(false);
    },
  });

  return (
    <div className="flex flex-col h-full w-full">
      <div className="col-span-3 lg:col-span-4 lg:border-l">
        <div className="h-full px-4 py-6 lg:px-8 flex flex-col gap-2">
          <div className="flex flex-row justify-between mb-4">
            <h1 className="text-2xl font-bold tracking-tighter">
              Explore tuners near you
            </h1>
            <MapModeSearch />
          </div>

          <Card className="w-full">
            <CardContent className="w-full p-4">
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row items-end gap-2">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={nameQuery}
                      placeholder="Name of a tuning store"
                      onChange={(e) => {
                        setNameQuery(e.target.value);
                      }}
                    />
                  </div>

                  <Button
                    onClick={() => {
                      setIsSearching(true);
                      search.mutate({
                        query: nameQuery,
                        type: "name",
                      });
                    }}
                    disabled={isSearching}
                  >
                    <Search size={24} />
                  </Button>
                </div>

                <div className="flex flex-row gap-4 items-end">
                  <div className="flex flex-row items-end gap-2">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="city">Country</Label>
                      <Input
                        id="country"
                        placeholder="Country"
                        value={countryQuery}
                        onChange={(e) => {
                          setCountryQuery(e.target.value);
                        }}
                      />
                    </div>
                    <Button
                      onClick={() => {
                        setIsSearching(true);
                        search.mutate({
                          query: countryQuery,
                          type: "country",
                        });
                      }}
                      disabled={isSearching}
                    >
                      <Search size={24} />
                    </Button>
                  </div>

                  <div className="flex flex-row items-end gap-2">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="City"
                        value={cityQuery}
                        onChange={(e) => {
                          setCityQuery(e.target.value);
                        }}
                      />
                    </div>

                    <Button
                      onClick={() => {
                        setIsSearching(true);
                        search.mutate({
                          query: cityQuery,
                          type: "city",
                        });
                      }}
                      disabled={isSearching}
                    >
                      <Search size={24} />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {isSearching ? (
            <div className="mt-4 w-full flex justify-center items-center h-20">
              <Icons.spinner className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <SearchResults stores={stores} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CartunersExplore;
