export interface StoragePort {
  save(date: string, time: string, kwh: number): void;
}
