function formatDate(date: Date): string {
  return date.toLocaleString("en-us", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

export class InsufficientCreditsAvailableError extends Error {
  constructor(date: Date) {
    let formattedDate = formatDate(date);

    super(
      `'${formattedDate}' is either fully booked or you don't have any available appointments left.`
    );
    this.name = "InsufficientCreditsAvailableError";
  }
}

export class UnavailableTimeError extends Error {
  constructor(date: Date) {
    let formattedDate = formatDate(date);

    super(`Unavailable time: ${formattedDate}`);
    this.name = "UnavailableTimeError";
  }
}

export class DuplicateBookingError extends Error {
  constructor(date: Date) {
    let formattedDate = formatDate(date);

    super(`Duplicate booking: ${formattedDate}`);
    this.name = "DuplicateBookingError";
  }
}

export class UnavailableDateError extends Error {
  constructor(date: Date) {
    let formattedDate = formatDate(date);

    super(`Unavailable date: ${formattedDate}`);
    this.name = "UnavailableDateError";
  }
}
