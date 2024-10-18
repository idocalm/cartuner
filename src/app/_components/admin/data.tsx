import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";

export const labels = [
  {
    value: "store_request",
    label: "New Store Request",
  },
];

export const statuses = [
  {
    value: "todo",
    label: "Todo",
    icon: CircleIcon,
  },
  {
    value: "accepted",
    label: "Accepted",
    icon: CheckCircledIcon,
  },
  {
    value: "denied",
    label: "Denied",
    icon: CrossCircledIcon,
  },
];

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownIcon,
  },

  {
    label: "High",
    value: "high",
    icon: ArrowUpIcon,
  },
];
