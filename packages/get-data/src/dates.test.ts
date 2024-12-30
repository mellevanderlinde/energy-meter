import { getDates } from "./dates";

it("should return an array of dates", () => {
  const pattern: RegExp = /\d{4}-\d{2}-\d{2}/;

  let dates = getDates(1);
  expect(dates[0]).toMatch(pattern);
  expect(dates[1]).toBeUndefined();
  expect(dates).toHaveLength(1);

  dates = getDates(2);
  expect(dates[0]).toMatch(pattern);
  expect(dates[1]).toMatch(pattern);
  expect(dates[2]).toBeUndefined();

  dates = getDates(30);
  expect(dates[0]).toMatch(pattern);
  expect(dates[15]).toMatch(pattern);
  expect(dates[29]).toMatch(pattern);
  expect(dates).toHaveLength(30);

  dates = getDates(365);
  expect(dates[0]).toMatch(pattern);
  expect(dates[182]).toMatch(pattern);
  expect(dates[364]).toMatch(pattern);
  expect(dates).toHaveLength(365);
});
