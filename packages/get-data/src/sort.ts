import type { GetDataOutput } from "./types";

export function sortData(data: GetDataOutput): GetDataOutput {
  for (const item of data) {
    item.datetime = `${item.date}T${item.time}`;
  }

  data.sort((a, b) => {
    return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
  });

  return data;
}
