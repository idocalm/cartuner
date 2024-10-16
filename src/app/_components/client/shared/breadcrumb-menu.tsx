import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { v4 as uuidv4 } from "uuid";

interface Item {
  name: string;
  onClick: () => void;
}

interface BreadcrumbMenuInterface {
  items: Item[];
}

const BreadcrumbMenu: React.FC<BreadcrumbMenuInterface> = ({ items }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => {
          if (index !== items.length - 1) {
            return (
              <>
                <BreadcrumbItem key={uuidv4()}>
                  <BreadcrumbLink onClick={item.onClick}>
                    {item.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            );
          }
          return (
            <>
              <BreadcrumbItem key={uuidv4()}>
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbMenu;
