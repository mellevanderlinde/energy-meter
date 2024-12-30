import { getDateTime, timeToSave } from "./datetime";

it("should return the current date and time", () => {
  const result = getDateTime();
  expect(result.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(result.time).toMatch(/^\d{2}:\d{2}:\d{2}$/);
});

it("should return false when last saved time is less than 5 minutes ago", () => {
  const fourMinutesAgo = Date.now() - 4 * 60 * 1000;
  expect(timeToSave(fourMinutesAgo)).toBe(false);
  expect(timeToSave(Date.now())).toBe(false);
});

it("should return true when last saved time is more than 5 minutes ago", () => {
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
  const sixMinutesAgo = Date.now() - 6 * 60 * 1000;
  expect(timeToSave(fiveMinutesAgo)).toBe(true);
  expect(timeToSave(sixMinutesAgo)).toBe(true);
});
