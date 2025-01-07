import { ReadlineParser, SerialPort } from "serialport";
import type { MeterReaderPort } from "../ports/meter-reader-port";
import type { Metric } from "../types";

export class SerialPortAdapter implements MeterReaderPort {
  private port: SerialPort;
  private parser: ReadlineParser;
  private regex: RegExp;

  constructor(path: string, port?: SerialPort) {
    this.port = port || new SerialPort({ path, baudRate: 115200 });
    this.parser = this.port.pipe(new ReadlineParser());
    this.regex = /1-0:1\.8\.(1|2)\((\d+\.\d+)\*kWh\)/;
  }

  public onDataReceived(
    handler: (value: string, metric: Metric) => void,
  ): void {
    this.parser.on("data", (data: string) => {
      const match = this.regex.exec(data);
      if (match) {
        const metric = match[1] === "1" ? "kwh1" : "kwh2";
        handler(match[2], metric);
      }
    });
  }
}
