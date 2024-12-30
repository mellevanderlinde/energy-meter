import { sortData } from "./sort";
import { GetDataOutput } from "./types";

export async function getMockData(
  numberOfDays: number,
  data: GetDataOutput,
): Promise<GetDataOutput> {
  const now = new Date();

  for (let i = 0; i < numberOfDays; i++) {
    for (let j = 0; j < 24; j += 6) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      date.setHours(j, 0, 0, 0);

      const datetime = date.toISOString().split(".")[0].replace("Z", "");

      data.push({
        date: date.toISOString().split("T")[0],
        time: date.toTimeString().split(" ")[0],
        datetime,
        kwh: parseFloat(Math.random().toFixed(3)),
      });
    }
  }

  return sortData(data);
}
