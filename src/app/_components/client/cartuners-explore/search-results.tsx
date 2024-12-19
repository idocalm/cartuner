import type { Store } from "@prisma/client";
import TunerCard from "./tuner-card";

const SearchResults: React.FC<{ stores: Store[] }> = ({ stores }) => {
  if (stores.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-20">
        <div className="text-lg text-gray-500 font-bold tracking-tighter">
          No results found
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {stores.map((store, index) => (
        <TunerCard
          key={index}
          location={store.address}
          stars={store.stars}
          reviewsCount={store.reviewCount}
          name={store.name}
          image={store.image}
          id={store.id}
        />
      ))}
    </div>
  );
};

export default SearchResults;
