import { DynamodbAdapter } from "./adapters/dynamodb-adapter";
import { SerialPortAdapter } from "./adapters/serial-port-adapter";
import { DataProcessor } from "./core/data-processor";

function run(): void {
  const serialPort = new SerialPortAdapter("/dev/ttyUSB0");
  const dynamodb = new DynamodbAdapter("energy-meter");
  const processor = new DataProcessor(dynamodb);
  serialPort.onDataReceived(processor.processData.bind(processor));
}

run();
