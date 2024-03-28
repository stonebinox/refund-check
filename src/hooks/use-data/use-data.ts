import { useEffect, useState } from "react";

import { ProcessedRequestSchema } from "../../types/ProcessedRequestSchema";
import { data } from "../../data/store";
import { RefundRequestSchema } from "../../types/RefundRequestSchema";
import moment from "moment-timezone";
import { TimezoneMap } from "../../types/TimezoneMap";

const tosChange = 1577919600;
const newPhoneTosLimit = 86400;
const oldPhoneTsLimit = 14400;
const newWebTosLimit = 57600;
const oldWebTosLimit = 28800;
const timezoneMap: TimezoneMap[] = [
  { timezone: "utc", fullName: "Europe/London" },
  { timezone: "pst", fullName: "America/Los_Angeles" },
  { timezone: "est", fullName: "America/New_York" },
  { timezone: "cet", fullName: "Europe/Paris" },
];

export const useData = () => {
  const [processedRequests, setProcessedRequests] = useState<
    ProcessedRequestSchema[]
  >([]);

  const getRegisteredTs = (ts: number, timezone: string) => {
    const mappedTimezone =
      timezoneMap.find((map) => map.timezone === timezone)?.fullName ||
      "Europe/London";
    const originTs = moment.tz(ts * 1000, mappedTimezone);
    const utcEquivalent = originTs.utc();
    const dayOfWeek = utcEquivalent.format("dddd");

    if (dayOfWeek === "Saturday") {
      return utcEquivalent
        .add(2, "days") // move it to monday
        .hour(9) // 9 AM UTC
        .tz(mappedTimezone) // convert it back to PST
        .unix();
    } else if (dayOfWeek === "Sunday") {
      return utcEquivalent
        .add(1, "days") // move it to monday
        .hour(9) // 9 AM UTC
        .tz(mappedTimezone) // convert it back to PST
        .unix();
    } else if (dayOfWeek === "Friday") {
      const eod = utcEquivalent.clone().hour(17).minute(0).second(0);
      const sod = utcEquivalent.clone().hour(9).minute(0).second(0); // Start Of Day
      const isBeforeEod = utcEquivalent.isBefore(eod);
      const isAfterSod = utcEquivalent.isAfter(sod);

      if (isBeforeEod && isAfterSod) {
        return ts;
      }

      if (!isAfterSod) {
        // if early in the day before 9 AM
        return utcEquivalent.clone().hour(9).minute(0).second(0).unix();
      }

      return utcEquivalent
        .add(3, "days") // move it to monday
        .hour(9) // 9 AM UTC
        .tz(mappedTimezone) // convert it back to PST
        .unix();
    } else {
      const eod = utcEquivalent.clone().hour(17).minute(0).second(0);
      const sod = utcEquivalent.clone().hour(9).minute(0).second(0); // Start Of Day
      const isBeforeEod = utcEquivalent.isBefore(eod);
      const isAfterSod = utcEquivalent.isAfter(sod);

      if (isBeforeEod && isAfterSod) {
        return ts;
      }

      if (!isAfterSod) {
        // if early in the day before 9 AM
        return utcEquivalent.clone().hour(9).minute(0).second(0).unix();
      }

      return utcEquivalent
        .add(1, "days") // move it to next day
        .hour(9) // 9 AM UTC
        .tz(mappedTimezone) // convert it back to PST
        .unix();
    }
  };

  const processRow = (row: RefundRequestSchema) => {
    const {
      createdAt: signupTs,
      timezone,
      requestSource,
      refundTs,
      investmentTs,
    } = row;

    let refundRegisteredTs: number = refundTs;
    let approved = false;

    if (signupTs > tosChange) {
      let limit = newWebTosLimit; // default to web limit

      if (requestSource === "phone") {
        limit = newPhoneTosLimit;

        refundRegisteredTs = getRegisteredTs(refundTs, timezone);
      } else {
        limit = newWebTosLimit;
        refundRegisteredTs = refundTs;
      }

      if (refundRegisteredTs - investmentTs >= limit) {
        approved = true;
      }
    } else {
      let limit = oldWebTosLimit; // default to web limit

      if (requestSource === "phone") {
        limit = oldPhoneTsLimit;

        refundRegisteredTs = getRegisteredTs(refundTs, timezone);
      } else {
        limit = oldWebTosLimit;
        refundRegisteredTs = refundTs;
      }

      if (refundRegisteredTs - investmentTs >= limit) {
        approved = true;
      }
    }

    const processedRow = row;

    return {
      ...processedRow,
      approved, // to determine this
      registeredTs: refundRegisteredTs,
    };
  };

  useEffect(() => {
    const processedData = data.map((row) => processRow(row));

    setProcessedRequests(processedData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return processedRequests;
};
