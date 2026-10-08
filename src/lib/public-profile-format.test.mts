import assert from "node:assert/strict";
import test from "node:test";
import { formatProfileTime, weekdayLabel } from "./public-profile-format.ts";

test("public profile time formatting uses 12-hour time", () => {
  assert.equal(formatProfileTime("00:00"), "12:00 AM");
  assert.equal(formatProfileTime("09:00:00"), "9:00 AM");
  assert.equal(formatProfileTime("12:00"), "12:00 PM");
  assert.equal(formatProfileTime("21:00"), "9:00 PM");
});

test("public profile weekday labels follow the existing one-through-seven contract", () => {
  assert.equal(weekdayLabel(1), "Monday");
  assert.equal(weekdayLabel(7), "Sunday");
});
