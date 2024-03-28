import { useEffect, useState } from "react";

import { ProcessedRequestSchema } from "../../types/ProcessedRequestSchema";
import { data } from "../../data/store";
import { RefundRequestSchema } from "../../types/RefundRequestSchema";
import moment from "moment-timezone";
import {
  endHourOfDay,
  newPhoneTosLimit,
  newWebTosLimit,
  oldPhoneTsLimit,
  oldWebTosLimit,
  startHourOfDay,
  timezoneMap,
  tosChange,
} from "../../globals";

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
    const endOfDay = utcEquivalent
      .clone()
      .hour(endHourOfDay)
      .minute(0)
      .second(0);
    const startOfDay = utcEquivalent
      .clone()
      .hour(startHourOfDay)
      .minute(0)
      .second(0);
    const isBeforeEndOfDay = utcEquivalent.isBefore(endOfDay);
    const isAfterStartOfDay = utcEquivalent.isAfter(startOfDay);

    if (dayOfWeek === "Saturday") {
      return utcEquivalent
        .add(2, "days") // move it to monday
        .hour(startHourOfDay) // 9 AM UTC
        .minute(0)
        .second(0)
        .tz(mappedTimezone) // convert it back to PST
        .unix();
    } else if (dayOfWeek === "Sunday") {
      return utcEquivalent
        .add(1, "days") // move it to monday
        .hour(9) // 9 A.hour(startHourOfDay) // 9 AM UTC
        .minute(0)
        .second(0)
        .tz(mappedTimezone) // convert it back to PST
        .unix();
    } else {
      if (isBeforeEndOfDay && isAfterStartOfDay) {
        return ts;
      }

      if (!isAfterStartOfDay) {
        // if early in the day before 9 AM
        return utcEquivalent
          .clone()
          .hour(startHourOfDay)
          .minute(0)
          .second(0)
          .unix();
      }

      let skipDayCount = 1;

      if (dayOfWeek === "Friday") {
        skipDayCount = 3;
      }

      return utcEquivalent
        .add(skipDayCount, "days") // move it to next day
        .hour(startHourOfDay) // 9 AM UTC
        .minute(0)
        .second(0)
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
      let limit = newWebTosLimit; // defaults to web limit

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
      let limit = oldWebTosLimit; // defaults to web limit

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
