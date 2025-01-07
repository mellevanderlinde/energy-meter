import { expect, it } from "vitest";
import { sortData } from "./sort";

it("should sort data by datetime", () => {
  const data = [
    { date: "2021-01-31", time: "22:00:32", kwh: 3 },
    { date: "2021-01-02", time: "00:00:29", kwh: 1 },
    { date: "2022-01-01", time: "10:12:20", kwh: 4 },
    { date: "2021-04-30", time: "01:13:39", kwh: 2 },
  ];

  const result = sortData(data);

  expect(result).toEqual([
    {
      date: "2021-01-02",
      time: "00:00:29",
      kwh: 1,
      datetime: "2021-01-02T00:00:29",
    },
    {
      date: "2021-01-31",
      time: "22:00:32",
      kwh: 3,
      datetime: "2021-01-31T22:00:32",
    },
    {
      date: "2021-04-30",
      time: "01:13:39",
      kwh: 2,
      datetime: "2021-04-30T01:13:39",
    },
    {
      date: "2022-01-01",
      time: "10:12:20",
      kwh: 4,
      datetime: "2022-01-01T10:12:20",
    },
  ]);
});
