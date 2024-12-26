"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

const chartConfig = {
  views: {
    label: "Views",
    color: "hsl(var(--chart-2))",
  },
  offers: {
    label: "Offers",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface Props {
  createdAt: Date;
}

const BidViewChart: React.FC<Props> = ({ createdAt }) => {
  // generate a entry for each day that has passed since createdAt
  // calculate how many days have passed since createdAt
  const hours = Math.floor(
    Math.abs(new Date().getTime() - createdAt.getTime()) / 36e5
  );

  const chartData = Array.from({ length: hours + 1 }, (_, i) => {
    // create a new date object for each hour, accounting for the fat that any hours over 24 should be days
    const date = new Date(createdAt);
    date.setHours(date.getHours() + i);
    date.setDate(date.getDate() + Math.floor(date.getHours() / 24));

    const normalDistribution = (x: number) =>
      Math.exp(-Math.pow(x, 2) / 2) / Math.sqrt(2 * Math.PI);

    return {
      key: date.toLocaleDateString(),
      views: normalDistribution((i - hours / 2) / (hours / 4)) * 100,
      offers: normalDistribution((i - hours / 2) / (hours / 8)) * 80,
    };
  });

  return (
    <ChartContainer config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="key" tickLine={false} axisLine={false} />
        <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
        <defs>
          <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-views)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-views)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillOffers" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-offers)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-offers)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="views"
          type="natural"
          fill="url(#fillViews)"
          fillOpacity={0.4}
          stroke="var(--color-views)"
          stackId="a"
        />
        <Area
          dataKey="offers"
          type="natural"
          fill="url(#fillOffers)"
          fillOpacity={0.4}
          stroke="var(--color-offers)"
        />
      </AreaChart>
    </ChartContainer>
  );
};

export default BidViewChart;
