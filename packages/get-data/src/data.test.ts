import { expect, it, vi } from "vitest";
import { getData } from "./data";

it("should return mock data", async () => {
  vi.stubEnv("MOCK_DATA", "true");
  const data = await getData(1);

  expect(data).toHaveLength(4);
  // biome-ignore lint/performance/useTopLevelRegex: not needed for tests
  expect(data[0].date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  // biome-ignore lint/performance/useTopLevelRegex: not needed for tests
  expect(data[0].time).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  // biome-ignore lint/performance/useTopLevelRegex: not needed for tests
  expect(data[0].datetime).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
  expect(data[0].kwh).toBeGreaterThan(0);
  expect(data[0].kwh).toBeLessThan(1);
});
