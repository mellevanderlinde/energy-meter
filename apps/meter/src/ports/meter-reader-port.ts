import type { Metric } from "../types";

export interface MeterReaderPort {
  onDataReceived(handler: (value: string, metric: Metric) => void): void;
}
