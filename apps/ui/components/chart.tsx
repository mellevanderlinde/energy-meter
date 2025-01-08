"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type GetDataOutput, getData } from "get-data";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  kwh: {
    label: "kWh",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function Chart(): ReactNode {
  const [numberOfDays, setNumberOfDays] = useState("14");
  const [data, setData] = useState<GetDataOutput>([]);

  useEffect(() => {
    async function loadData() {
      const result = await getData(Number.parseFloat(numberOfDays));
      setData(result);
    }
    loadData();
  }, [numberOfDays]);

  const sumPerDay = useMemo(() => {
    const result: { [key: string]: number } = {};
    for (const entry of data) {
      const date = new Date(entry.datetime).toLocaleDateString("en-US");
      if (!result[date]) {
        result[date] = 0;
      }
      result[date] += entry.kwh;
    }
    return Object.entries(result).map(([date, kwh]) => ({ date, kwh }));
  }, [data]);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Energy Usage</CardTitle>
          <CardDescription>Showing kWh consumption over time</CardDescription>
        </div>
        <Select value={numberOfDays} onValueChange={setNumberOfDays}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {[
              { value: "14", label: "Last 14 days" },
              { value: "30", label: "Last 30 days" },
              { value: "90", label: "Last 3 months" },
            ].map(({ value, label }) => (
              <SelectItem value={value} className="rounded-lg" key={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[500px] w-[1200px]"
        >
          <BarChart
            accessibilityLayer={true}
            data={sumPerDay}
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
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis
              dataKey="kwh"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="kwh"
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }
                />
              }
            />
            <Bar dataKey="kwh" fill={chartConfig.kwh.color} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
