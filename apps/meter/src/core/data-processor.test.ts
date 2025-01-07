import { beforeEach, describe, expect, it, vi } from "vitest";
import type { StoragePort } from "../ports/storage-port";
import { DataProcessor } from "./data-processor";

describe("processData", () => {
  let storagePort: StoragePort;
  let processor: DataProcessor;

  beforeEach(() => {
    vi.useFakeTimers();

    storagePort = { save: vi.fn() } as StoragePort;
    processor = new DataProcessor(storagePort);
  });

  it("should save data starting from the second 5-minute cycle", () => {
    processor.processData("001000.000", "kwh1");
    processor.processData("002000.000", "kwh2");
    vi.advanceTimersByTime(5 * 60 * 1000);
    processor.processData("001000.001", "kwh1");
    processor.processData("002000.000", "kwh2");
    vi.advanceTimersByTime(5 * 60 * 1000);
    processor.processData("001000.003", "kwh1");
    processor.processData("002000.000", "kwh2");
    expect(storagePort.save).toHaveBeenCalledTimes(1);
    expect(storagePort.save).toHaveBeenCalledWith(
      expect.stringMatching(/\d{4}-\d{2}-\d{2}/),
      expect.stringMatching(/\d{2}:\d{2}:\d{2}/),
      0.002,
    );
    // biome-ignore lint/complexity/useLiteralKeys: property is private
    expect(processor["lastSavedTime"]).toBe(Date.now());
    // biome-ignore lint/complexity/useLiteralKeys: property is private
    expect(processor["lastSavedKwh"]).toBe(3000.003);
    vi.advanceTimersByTime(5 * 60 * 1000);
    processor.processData("001000.010", "kwh1");
    processor.processData("002000.000", "kwh2");
    expect(storagePort.save).toHaveBeenCalledTimes(2);
    expect(storagePort.save).toHaveBeenCalledWith(
      expect.stringMatching(/\d{4}-\d{2}-\d{2}/),
      expect.stringMatching(/\d{2}:\d{2}:\d{2}/),
      0.007,
    );
    // biome-ignore lint/complexity/useLiteralKeys: property is private
    expect(processor["lastSavedTime"]).toBe(Date.now());
    // biome-ignore lint/complexity/useLiteralKeys: property is private
    expect(processor["lastSavedKwh"]).toBe(3000.01);
  });

  it("should not save data after the first 5-minute cycle", () => {
    // biome-ignore lint/complexity/useLiteralKeys: property is private
    expect(processor["firstSave"]).toBe(true);
    processor.processData("001000.000", "kwh1");
    processor.processData("002000.000", "kwh2");
    // biome-ignore lint/complexity/useLiteralKeys: property is private
    expect(processor["firstSave"]).toBe(true);
    vi.advanceTimersByTime(5 * 60 * 1000);
    // biome-ignore lint/complexity/useLiteralKeys: property is private
    expect(processor["firstSave"]).toBe(true);
    processor.processData("001000.001", "kwh1");
    // biome-ignore lint/complexity/useLiteralKeys: property is private
    expect(processor["firstSave"]).toBe(false);
    processor.processData("002000.000", "kwh2");
    // biome-ignore lint/complexity/useLiteralKeys: property is private
    expect(processor["firstSave"]).toBe(false);
    expect(storagePort.save).toHaveBeenCalledTimes(0);
    // biome-ignore lint/complexity/useLiteralKeys: property is private
    expect(processor["lastSavedTime"]).toBe(Date.now());
  });

  it("should update kwh values", () => {
    processor.processData("002000.500", "kwh1");
    processor.processData("001500.300", "kwh2");
    // biome-ignore lint/complexity/useLiteralKeys: property is private
    expect(processor["kwh1"]).toBe(2000.5);
    // biome-ignore lint/complexity/useLiteralKeys: property is private
    expect(processor["kwh2"]).toBe(1500.3);
    // biome-ignore lint/complexity/useLiteralKeys: property is private
    expect(processor["totalKwh"]).toBe(3500.8);
  });

  it('should set "lastSavedKwh" to sum of "kwh1" and "kwh2" after the first 5-minute cycle', () => {
    // biome-ignore lint/complexity/useLiteralKeys: property is private
    expect(processor["lastSavedKwh"]).toBe(0);
    processor.processData("00400.500", "kwh1");
    processor.processData("01000.500", "kwh2");
    // biome-ignore lint/complexity/useLiteralKeys: property is private
    expect(processor["lastSavedKwh"]).toBe(0);
    vi.advanceTimersByTime(5 * 60 * 1000);
    processor.processData("00500.000", "kwh1");
    processor.processData("01000.500", "kwh2");
    // biome-ignore lint/complexity/useLiteralKeys: property is private
    expect(processor["lastSavedKwh"]).toBe(1500.5);
  });

  it('should calculate "usedKwh" and update "lastSavedKwh"', () => {
    processor.processData("001000.000", "kwh1");
    processor.processData("002000.000", "kwh2");
    // biome-ignore lint/complexity/useLiteralKeys: property is private
    expect(processor["lastSavedKwh"]).toBe(0);
    vi.advanceTimersByTime(5 * 60 * 1000);
    processor.processData("001000.002", "kwh1");
    processor.processData("002000.000", "kwh2");
    processor.processData("001000.020", "kwh1");
    // biome-ignore lint/complexity/useLiteralKeys: property is private
    expect(processor["lastSavedKwh"]).toBe(3000.002);
    expect(storagePort.save).toHaveBeenCalledTimes(0);
    vi.advanceTimersByTime(5 * 60 * 1000);
    processor.processData("001001.000", "kwh1");
    processor.processData("002000.000", "kwh2");
    // biome-ignore lint/complexity/useLiteralKeys: property is private
    expect(processor["lastSavedKwh"]).toBe(3001);
    expect(storagePort.save).toHaveBeenCalledTimes(1);
    expect(storagePort.save).toHaveBeenCalledWith(
      expect.stringMatching(/\d{4}-\d{2}-\d{2}/),
      expect.stringMatching(/\d{2}:\d{2}:\d{2}/),
      0.998,
    );
  });
});
