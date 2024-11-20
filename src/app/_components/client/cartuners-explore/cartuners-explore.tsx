import { Search } from "lucide-react";
import React from "react";

import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Icons } from "~/components/ui/icons";
import { useState } from "react";
import { Store } from "@prisma/client";
import { api } from "~/trpc/react";
import SearchResults from "./search-results";

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
          <h1 className="text-2xl font-bold tracking-tighter">
            Explore tuners near you
          </h1>
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
                    <Search
                      size={24}
                      className={isSearching ? "animate-spin" : ""}
                    />
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
                      <Search
                        size={24}
                        className={isSearching ? "animate-spin" : ""}
                      />
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
                      <Search
                        size={24}
                        className={isSearching ? "animate-spin" : ""}
                      />
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
