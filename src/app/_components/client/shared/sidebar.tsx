import { Button } from "~/components/ui/button";
import { icons } from "lucide-react";
import { cn } from "~/lib/utils";

export interface Category {
  name: string;
  tabs: Tab[];
}

export interface Tab {
  icon?: keyof typeof icons;
  name: string;
}

const Icon = ({ name }: { name: keyof typeof icons }) => {
  const IconComponent = icons[name];
  return <IconComponent size={17} />;
};

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  categories: Category[];
  selectedTab: string;
  onTabClick: (tabName: string) => void;
}
const Sidebar = ({
  className,
  categories,
  selectedTab,
  onTabClick,
}: SidebarProps) => {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        {categories.map((category) => (
          <div key={category.name} className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              {category.name}
            </h2>
            <div className="space-y-1">
              {category.tabs.map((tab) => (
                <Button
                  key={tab.name}
                  variant={selectedTab === tab.name ? "secondary" : "ghost"}
                  onClick={() =>
                    selectedTab !== tab.name && onTabClick(tab.name)
                  }
                  className="w-full justify-start"
                >
                  {tab.icon && (
                    <div className="mr-2 w-4 h-4 flex justify-center items-center">
                      <Icon name={tab.icon} />
                    </div>
                  )}
                  {tab.name}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
