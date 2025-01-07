import { beforeAll, describe, expect, it, vi } from "vitest";
import { SerialPortAdapter } from "./serial-port-adapter";

describe("SerialPortAdapter", () => {
  let adapter: SerialPortAdapter;
  let regex: RegExp;

  beforeAll(() => {
    adapter = new SerialPortAdapter("/dev/ttyUSBMock", {
      pipe: vi.fn(),
    } as never);
    // biome-ignore lint/complexity/useLiteralKeys: property is private
    regex = adapter["regex"];
  });

  it("should get kwh values from regex", () => {
    let result = regex.exec("1-0:1.8.1(00.456*kWh)");
    expect(result?.slice(0, 3)).toEqual([
      "1-0:1.8.1(00.456*kWh)",
      "1",
      "00.456",
    ]);

    result = regex.exec("1-0:1.8.1(02.340*kWh)");
    expect(result?.slice(0, 3)).toEqual([
      "1-0:1.8.1(02.340*kWh)",
      "1",
      "02.340",
    ]);

    result = regex.exec("1-0:1.8.1(0123.987*kWh)");
    expect(result?.slice(0, 3)).toEqual([
      "1-0:1.8.1(0123.987*kWh)",
      "1",
      "0123.987",
    ]);

    result = regex.exec("1-0:1.8.2(09012.345*kWh)");
    expect(result?.slice(0, 3)).toEqual([
      "1-0:1.8.2(09012.345*kWh)",
      "2",
      "09012.345",
    ]);

    result = regex.exec("1-0:1.8.2(01.234*kWh)");
    expect(result?.slice(0, 3)).toEqual([
      "1-0:1.8.2(01.234*kWh)",
      "2",
      "01.234",
    ]);

    result = regex.exec("1-0:1.8.2(00.000*kWh)");
    expect(result?.slice(0, 3)).toEqual([
      "1-0:1.8.2(00.000*kWh)",
      "2",
      "00.000",
    ]);
  });

  it("should not get kwh values from regex", () => {
    let result = regex.exec("1-0:31.7.0(012*A)");
    expect(result).toBeNull();

    result = regex.exec("KAIFA");
    expect(result).toBeNull();
  });
});
