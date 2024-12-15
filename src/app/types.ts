import type { OrderStatus } from "@prisma/client";

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  name: string;
  type: string;
  vin: string;
  notes: string;
}

export interface Sale {
  id: string;
  realId: string;
  status: OrderStatus;
  customer?: {
    name: string;
    email: string;
    avatar: string;
  };
  total: number;
  notes: string;
}
