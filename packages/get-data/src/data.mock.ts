import { sortData } from "./sort";
import type { GetDataOutput } from "./types";

export function getMockData(
  numberOfDays: number,
  data: GetDataOutput,
): GetDataOutput {
  const now = new Date();

  for (let day = 0; day < numberOfDays; day++) {
    for (let hour = 0; hour < 24; hour += 6) {
      const date = new Date(now);
      date.setDate(now.getDate() - day);
      date.setHours(hour, 0, 0, 0);

      const datetime = date.toISOString().split(".")[0].replace("Z", "");

      data.push({
        date: date.toISOString().split("T")[0],
        time: date.toTimeString().split(" ")[0],
        datetime,
        kwh: Number.parseFloat(Math.random().toFixed(3)),
      });
    }
  }

  return sortData(data);
}
