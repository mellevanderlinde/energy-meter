import type { StoragePort } from "../ports/storage-port";
import type { Metric } from "../types";
import { getDateTime, timeToSave } from "./datetime";

export class DataProcessor {
  private storagePort: StoragePort;
  private kwh1 = 0;
  private kwh2 = 0;
  private totalKwh = 0;
  private lastSavedKwh = 0;
  private lastSavedTime: number = Date.now();
  private firstSave = true;

  constructor(storagePort: StoragePort) {
    this.storagePort = storagePort;
  }

  public processData(value: string, metric: Metric): void {
    this.updateKwhValues(value, metric);
    if (timeToSave(this.lastSavedTime)) this.saveData();
  }

  private updateKwhValues(value: string, metric: Metric): void {
    if (metric === "kwh1") this.kwh1 = Number.parseFloat(value);
    if (metric === "kwh2") this.kwh2 = Number.parseFloat(value);
    this.totalKwh = this.kwh1 + this.kwh2;
  }

  private saveData(): void {
    if (!this.firstSave) {
      const usedKwh = Number.parseFloat(
        (this.totalKwh - this.lastSavedKwh).toFixed(3),
      );
      const { date, time } = getDateTime();
      this.storagePort.save(date, time, usedKwh);
    }

    this.lastSavedTime = Date.now();
    this.lastSavedKwh = this.totalKwh;
    this.firstSave = false; // Skip first save, as we need to know the previous value to calculate the used kwh
  }
}
