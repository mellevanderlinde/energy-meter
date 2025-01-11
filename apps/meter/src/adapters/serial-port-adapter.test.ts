import { MockBinding } from "@serialport/binding-mock";
import { SerialPort } from "serialport";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";
import { SerialPortAdapter } from "./serial-port-adapter";

describe("SerialPortAdapter", () => {
  let adapter: SerialPortAdapter;
  let port: SerialPort;
  let handler: Mock;

  beforeEach(() => {
    MockBinding.createPort("/dev/mock");
    port = new SerialPort({
      path: "/dev/mock",
      baudRate: 115200,
      binding: MockBinding,
    });
    handler = vi.fn();
    adapter = new SerialPortAdapter("/dev/mock", port);
    adapter.onDataReceived(handler);
  });

  it("should call handler with kwh1 value", () => {
    port.emit("data", "1-0:1.8.1(00.123*kWh)\n");
    expect(handler).toHaveBeenNthCalledWith(1, "00.123", "kwh1");
  });

  it("should call handler with kwh2 value", () => {
    port.emit("data", "1-0:1.8.2(10.000*kWh)\n");
    expect(handler).toHaveBeenNthCalledWith(1, "10.000", "kwh2");
  });

  it("should not call handler", () => {
    port.emit("data", "1-0:31.7.0(012*A)\n");
    port.emit("data", "KAIFA\n");
    expect(handler).not.toHaveBeenCalled();
  });
});
