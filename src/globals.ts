import { TimezoneMap } from "./types/TimezoneMap";

export const tosChange = 1577919600;
export const newPhoneTosLimit = 86400;
export const oldPhoneTsLimit = 14400;
export const newWebTosLimit = 57600;
export const oldWebTosLimit = 28800;
export const timezoneMap: TimezoneMap[] = [
  { timezone: "utc", fullName: "Europe/London" },
  { timezone: "pst", fullName: "America/Los_Angeles" },
  { timezone: "est", fullName: "America/New_York" },
  { timezone: "cet", fullName: "Europe/Paris" },
];
export const startHourOfDay = 9;
export const endHourOfDay = 17;
