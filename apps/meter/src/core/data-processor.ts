import { StoragePort } from "../ports/storage-port";
import { getDateTime, timeToSave } from "./datetime";
import { Metric } from "../types";

export class DataProcessor {
  private storagePort: StoragePort;
  private kwh1: number = 0;
  private kwh2: number = 0;
  private totalKwh: number = 0;
  private lastSavedKwh: number = 0;
  private lastSavedTime: number = Date.now();
  private firstSave: boolean = true;

  constructor(storagePort: StoragePort) {
    this.storagePort = storagePort;
  }

  public processData(value: string, metric: Metric): void {
    console.log(`Processing data: ${value} ${metric}`);
    this.updateKwhValues(value, metric);
    if (timeToSave(this.lastSavedTime)) this.saveData();
  }

  private updateKwhValues(value: string, metric: Metric): void {
    if (metric === "kwh1") this.kwh1 = parseFloat(value);
    if (metric === "kwh2") this.kwh2 = parseFloat(value);
    this.totalKwh = this.kwh1 + this.kwh2;
  }

  private saveData(): void {
    console.log("Saving data");
    if (!this.firstSave) {
      const usedKwh = parseFloat(
        (this.totalKwh - this.lastSavedKwh).toFixed(3),
      );
      const { date, time } = getDateTime();
      console.log(`Saving ${usedKwh} kwh at ${date} ${time}`);
      this.storagePort.save(date, time, usedKwh);
    }

    this.lastSavedTime = Date.now();
    this.lastSavedKwh = this.totalKwh;
    this.firstSave = false; // Skip first save, as we need to know the previous value to calculate the used kwh
  }
}
