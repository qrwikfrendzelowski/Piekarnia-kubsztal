/**
 * Formatting utilities for GBP currency and pickup schedule dates.
 * Pure functions only — no DOM access, no side effects.
 */

const GBP_FORMATTER = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const PICKUP_DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const PICKUP_TIME_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/**
 * Normalises any supported date input into a valid Date instance.
 * Accepts Date instances, ISO-8601 strings and Unix timestamps (seconds or milliseconds).
 *
 * @param {Date|string|number} value - Raw date input.
 * @returns {Date} A valid Date instance.
 * @throws {TypeError} If the value cannot be parsed into a valid date.
 */
export function parseDate(value) {
  let date;

  if (value instanceof Date) {
    date = value;
  } else if (typeof value === "number" && Number.isFinite(value)) {
    // Heuristic: Unix timestamps below 1e12 are treated as seconds, not milliseconds.
    const timestamp = value < 1e12 ? value * 1000 : value;
    date = new Date(timestamp);
  } else if (typeof value === "string" && value.trim() !== "") {
    date = new Date(value);
  } else {
    throw new TypeError("parseDate expects a Date, a non-empty string or a finite number.");
  }

  if (Number.isNaN(date.getTime())) {
    throw new TypeError(`Unable to parse value into a valid date: ${String(value)}`);
  }

  return date;
}

/**
 * Formats an amount in pounds as GBP currency, e.g. 4.8 -> "£4.80".
 *
 * @param {number} amount - Price in GBP.
 * @returns {string} Localised currency string.
 * @throws {TypeError} If the amount is not a finite number.
 */
export function formatCurrency(amount) {
  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    throw new TypeError("formatCurrency expects a finite number.");
  }

  return GBP_FORMATTER.format(amount);
}

/**
 * Formats a pickup date for schedule display, e.g. "Saturday, 18 October 2026".
 *
 * @param {Date|string|number} value - Pickup date input.
 * @returns {string} Localised long-form date.
 */
export function formatPickupDate(value) {
  return PICKUP_DATE_FORMATTER.format(parseDate(value));
}

/**
 * Formats a pickup time in 24-hour notation, e.g. "09:30".
 *
 * @param {Date|string|number} value - Pickup time input.
 * @returns {string} Localised 24-hour time.
 */
export function formatPickupTime(value) {
  return PICKUP_TIME_FORMATTER.format(parseDate(value));
}

/**
 * Formats a full pickup slot (date + time),
 * e.g. "Saturday, 18 October 2026, 09:30".
 *
 * @param {Date|string|number} value - Pickup slot input.
 * @returns {string} Localised date and time label.
 */
export function formatPickupSlot(value) {
  return `${formatPickupDate(value)}, ${formatPickupTime(value)}`;
}
