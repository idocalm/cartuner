"use client";

import Menu from "~/app/_components/client/shared/menu";
import { api } from "~/trpc/react";
import Sidebar from "~/app/_components/client/shared/sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { useEffect, useState } from "react";
import MyVehicles from "~/app/_components/client/my-vehicles/my-vehicles";
import CartunersExplore from "~/app/_components/client/cartuners-explore/cartuners-explore";

const Dashboard = () => {
  const name = api.clients.name.useQuery();
  const avatar = api.clients.avatar.useQuery();
  const panels: Record<string, React.ReactNode> = {
    "My vehicles": <MyVehicles name={name.data || ""} />,
    Cartuners: <CartunersExplore />,
  };

  const [selectedTab, setSelectedTab] = useState<string>("My vehicles");
  const [currentPanel, setCurrentPanel] = useState<React.ReactNode>(
    panels[selectedTab]
  );

  useEffect(() => {
    setCurrentPanel(panels[selectedTab]);
  }, [selectedTab, name.data, avatar.data]);

  return (
    <main className="flex h-screen min-h-screen w-screen flex-col">
      <Menu avatar={avatar.data} />
      <div className="border-t flex flex-row h-full relative">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel className="min-w-[250px]" defaultSize={10}>
            <Sidebar
              onTabClick={(tabName: string) => {
                if (tabName === selectedTab) {
                  return;
                }
                setSelectedTab(tabName);
              }}
              categories={[
                {
                  name: "Vehicles & Incidents",
                  tabs: [
                    {
                      icon: "Car",
                      name: "My vehicles",
                    },
                    {
                      icon: "Flag",
                      name: "Serviced vehicles",
                    },
                    {
                      icon: "History",
                      name: "Incidents",
                    },
                  ],
                },
                {
                  name: "Explore",
                  tabs: [
                    {
                      icon: "Map",
                      name: "Cartuners",
                    },
                  ],
                },
              ]}
              selectedTab={selectedTab}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel className="min-w-[50%]" defaultSize={90}>
            {currentPanel}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </main>
  );
};

export default Dashboard;
