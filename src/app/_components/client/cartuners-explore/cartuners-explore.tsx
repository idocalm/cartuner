import {
  CarIcon,
  Grid2X2Icon,
  Icon,
  PaintBucket,
  ShipWheelIcon,
  SquareStackIcon,
  Star,
} from "lucide-react";
import React from "react";
import { Card } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import categories from "~/data/tuners-categories";

const iconNameToNode: (iconName: string) => JSX.Element = (iconName) => {
  switch (iconName) {
    case "paint":
      return <PaintBucket size={24} />;
    case "body":
      return <CarIcon size={24} />;
    case "performance":
      return <SquareStackIcon size={24} />;
    case "interior":
      return <Grid2X2Icon size={24} />;
    case "wheels":
      return <ShipWheelIcon size={24} />;
    default:
      return <PaintBucket size={24} />;
  }
};

interface TunerCardInterface {
  location: string;
  stars: number;
  name: string;
  image: string;
  desc: string;
}

const TunerCard: React.FC<TunerCardInterface> = ({
  location,
  stars,
  name,
  image,
  desc,
}) => {
  return (
    <Card className="h-48">
      <div className="flex flex-col h-full">
        <div className="h-24 w-full bg-gray-200"></div>
        <div className="flex flex-col h-full p-4">
          <div className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-bold">{name}</h2>
            <div className="flex flex-row items-center gap-1">
              <Star size={16} />
              <span>{stars}</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">{location}</div>
          <div className="text-sm text-gray-500">{desc}</div>
        </div>
      </div>
    </Card>
  );
};

const TunersGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-4 ">
      {Array.from({ length: 25 }).map((_, index) => (
        <TunerCard
          key={index}
          location={"Dummy location"}
          stars={5}
          name={"Dummy name"}
          image={"Dummy image"}
          desc={"Dummy description"}
        />
      ))}
    </div>
  );
};

const PaintJobs: React.FC = () => {
  return (
    <TabsContent value="paint">
      <TunersGrid />
    </TabsContent>
  );
};

const BodyKits: React.FC = () => {
  return (
    <TabsContent value="body">
      <div>Body kits</div>
    </TabsContent>
  );
};

const Performance: React.FC = () => {
  return (
    <TabsContent value="performance">
      <div>Performance</div>
    </TabsContent>
  );
};

const Interior: React.FC = () => {
  return (
    <TabsContent value="interior">
      <div>Interior</div>
    </TabsContent>
  );
};

const Wheels: React.FC = () => {
  return (
    <TabsContent value="wheels">
      <div>Wheels</div>
    </TabsContent>
  );
};

const CartunersExplore = () => {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="col-span-3 lg:col-span-4 lg:border-l">
        <div className="h-full px-4 py-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tighter">
            Explore tuners near you
          </h1>
          <div className="mt-4 flex flex-col w-full h-20">
            <div className=" grid grid-rows-1 grid-flow-col auto-cols-max">
              <Tabs>
                <TabsList
                  className="flex flex-row"
                  defaultValue={categories[0]?.icon}
                >
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category.text}
                      value={category.icon}
                      className="text-sm"
                    >
                      <div className="w-full h-full flex flex-row gap-2 items-center">
                        {iconNameToNode(category.icon)}
                        {category.text}
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
                <PaintJobs />
                <BodyKits />
                <Performance />
                <Interior />
                <Wheels />
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartunersExplore;
