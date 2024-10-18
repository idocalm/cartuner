"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
export const description = "An interactive bar chart";

const chartData = [
  { date: "2024-04-01", cartuner: 222, others: 100 },
  { date: "2024-04-02", cartuner: 175, others: 120 }, // Slight Cartuner increase
  { date: "2024-04-03", cartuner: 167, others: 30 },
  { date: "2024-04-04", cartuner: 242, others: 230 }, // Reduced others
  { date: "2024-04-05", cartuner: 373, others: 90 },
  { date: "2024-04-06", cartuner: 301, others: 120 }, // Slight reduction for others
  { date: "2024-04-07", cartuner: 245, others: 50 },
  { date: "2024-04-08", cartuner: 409, others: 320 },
  { date: "2024-04-09", cartuner: 300, others: 110 }, // Small Cartuner boost
  { date: "2024-04-10", cartuner: 261, others: 190 },
  { date: "2024-04-11", cartuner: 327, others: 320 }, // Others slight decrease
  { date: "2024-04-12", cartuner: 292, others: 110 },
  { date: "2024-04-13", cartuner: 342, others: 150 }, // Minor Cartuner advantage
  { date: "2024-04-14", cartuner: 320, others: 170 }, // Lower others
  { date: "2024-04-15", cartuner: 280, others: 120 },
  { date: "2024-04-16", cartuner: 220, others: 190 },
  { date: "2024-04-17", cartuner: 446, others: 160 },
  { date: "2024-04-18", cartuner: 364, others: 180 }, // Balanced
  { date: "2024-04-19", cartuner: 243, others: 180 },
  { date: "2024-04-20", cartuner: 233, others: 150 }, // Small Cartuner boost
  { date: "2024-04-21", cartuner: 560, others: 100 },
  { date: "2024-04-22", cartuner: 224, others: 170 },
  { date: "2024-04-23", cartuner: 400, others: 230 }, // Slight Cartuner boost
  { date: "2024-04-24", cartuner: 387, others: 290 },
  { date: "2024-04-25", cartuner: 215, others: 150 },
  { date: "2024-04-26", cartuner: 200, others: 130 }, // Cartuner more competitive
  { date: "2024-04-27", cartuner: 383, others: 120 },
  { date: "2024-04-28", cartuner: 150, others: 180 }, // Slight Cartuner boost
  { date: "2024-04-29", cartuner: 315, others: 111 },
  { date: "2024-04-30", cartuner: 454, others: 180 },
  { date: "2024-05-01", cartuner: 165, others: 220 },
  { date: "2024-05-02", cartuner: 293, others: 290 }, // More balanced
  { date: "2024-05-03", cartuner: 247, others: 190 },
  { date: "2024-05-04", cartuner: 385, others: 200 }, // Close but Cartuner advantage
  { date: "2024-05-05", cartuner: 481, others: 15 },
  { date: "2024-05-06", cartuner: 498, others: 190 }, // Almost balanced but Cartuner ahead
  { date: "2024-05-07", cartuner: 388, others: 300 },
  { date: "2024-05-08", cartuner: 180, others: 85 }, // Small Cartuner boost
  { date: "2024-05-09", cartuner: 227, others: 120 },
  { date: "2024-05-10", cartuner: 293, others: 130 },
  { date: "2024-05-11", cartuner: 335, others: 120 },
  { date: "2024-05-12", cartuner: 210, others: 90 }, // Balanced, slight Cartuner favor
  { date: "2024-05-13", cartuner: 197, others: 60 },
  { date: "2024-05-14", cartuner: 448, others: 190 },
  { date: "2024-05-15", cartuner: 473, others: 380 },
  { date: "2024-05-16", cartuner: 338, others: 100 },
  { date: "2024-05-17", cartuner: 499, others: 150 }, // Cartuner edge
  { date: "2024-05-18", cartuner: 315, others: 250 },
  { date: "2024-05-19", cartuner: 235, others: 180 },
  { date: "2024-05-20", cartuner: 177, others: 130 },
  { date: "2024-05-21", cartuner: 200, others: 140 }, // Slight Cartuner boost
  { date: "2024-05-22", cartuner: 115, others: 120 }, // Competitive Cartuner
  { date: "2024-05-23", cartuner: 252, others: 290 },
  { date: "2024-05-24", cartuner: 294, others: 220 },
  { date: "2024-05-25", cartuner: 201, others: 150 },
  { date: "2024-05-26", cartuner: 213, others: 170 },
  { date: "2024-05-27", cartuner: 420, others: 250 }, // Cartuner competitive
  { date: "2024-05-28", cartuner: 230, others: 190 },
  { date: "2024-05-29", cartuner: 300, others: 30 }, // Slight Cartuner boost
  { date: "2024-05-30", cartuner: 340, others: 180 },
  { date: "2024-05-31", cartuner: 178, others: 130 },
  { date: "2024-06-01", cartuner: 178, others: 100 },
  { date: "2024-06-02", cartuner: 470, others: 110 },
  { date: "2024-06-03", cartuner: 230, others: 160 }, // Small Cartuner boost
  { date: "2024-06-04", cartuner: 439, others: 380 },
  { date: "2024-06-05", cartuner: 405, others: 140 }, // Slight Cartuner increase
  { date: "2024-06-06", cartuner: 294, others: 250 },
  { date: "2024-06-07", cartuner: 323, others: 270 },
  { date: "2024-06-08", cartuner: 385, others: 320 },
  { date: "2024-06-09", cartuner: 438, others: 150 }, // Close competition
  { date: "2024-06-10", cartuner: 505, others: 200 },
  { date: "2024-06-11", cartuner: 115, others: 150 }, // Cartuner close to others
  { date: "2024-06-12", cartuner: 492, others: 420 },
  { date: "2024-06-13", cartuner: 115, others: 130 },
  { date: "2024-06-14", cartuner: 426, others: 380 },
  { date: "2024-06-15", cartuner: 307, others: 350 },
  { date: "2024-06-16", cartuner: 371, others: 310 },
  { date: "2024-06-17", cartuner: 475, others: 160 }, // Close but Cartuner wins
  { date: "2024-06-18", cartuner: 255, others: 110 },
];

const chartConfig = {
  views: {
    label: "Page Views",
  },
  cartuner: {
    label: "cartuner",
    color: "#D0FD3E",
  },
  others: {
    label: "Others",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const ChartA = () => {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("cartuner");

  const total = React.useMemo(
    () => ({
      cartuner: chartData.reduce((acc, curr) => acc + curr.cartuner, 0),
      others: chartData.reduce((acc, curr) => acc + curr.others, 0),
    }),
    []
  );

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>
            Satisfactory levels of clients using cartuner vs. others when it
            comes to car maintenance
          </CardTitle>
          <CardDescription>
            Showing total amount who rated their experience at a 4+ out of 5 in
            the last 3 months.
          </CardDescription>
        </div>
        <div className="flex">
          {["cartuner", "others"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value: string) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value: string) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ChartA;
