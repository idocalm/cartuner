import { DoorOpen } from "lucide-react";

import { cn } from "~/lib/utils";

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  store: string;
  selected: string;
  onSelected: (
    selected: "overview" | "customers" | "products" | "settings"
  ) => void;
}

export function MainNav({
  className,
  store,
  selected,
  onSelected,
  ...props
}: MainNavProps) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <p className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        <DoorOpen size={16} />
      </p>
      <p
        className={
          "text-sm font-medium transition-colors hover:text-primary hover:cursor-pointer " +
          (selected === "overview" ? "text-primary" : "text-muted-foreground")
        }
        onClick={() => {
          onSelected("overview");
        }}
      >
        Overview
      </p>
      <p
        onClick={() => {
          onSelected("customers");
        }}
        className={
          "text-sm font-medium transition-colors hover:text-primary hover:cursor-pointer " +
          (selected === "customers" ? "text-primary" : "text-muted-foreground")
        }
      >
        Customers
      </p>
      <p
        onClick={() => {
          onSelected("products");
        }}
        className={
          "text-sm font-medium transition-colors hover:text-primary hover:cursor-pointer " +
          (selected === "products" ? "text-primary" : "text-muted-foreground")
        }
      >
        Products
      </p>
      <p
        onClick={() => {
          onSelected("settings");
        }}
        className={
          "text-sm font-medium transition-colors hover:text-primary hover:cursor-pointer " +
          (selected === "settings" ? "text-primary" : "text-muted-foreground")
        }
      >
        Settings
      </p>
    </nav>
  );
}
