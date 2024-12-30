import { GetDataOutput } from "./types";

export function sortData(data: GetDataOutput): GetDataOutput {
  data.forEach((item) => {
    item.datetime = `${item.date}T${item.time}`;
  });

  data.sort((a, b) => {
    return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
  });

  return data;
}
