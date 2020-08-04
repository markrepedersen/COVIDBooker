export class UnavailableTimeError extends Error {
  constructor(time: string) {
    super(`The selected time was not available: ${time}`);
    this.name = "UnavailableTimeError";
  }
}

export class DuplicateBookingError extends Error {
  constructor() {
    super("Selected time was already booked in the past.");
    this.name = "DuplicateBookingError";
  }
}

export class UnavailableDateError extends Error {
  constructor(date: Date) {
    super(`The given date was not available: ${date}`);
    this.name = "UnavailableDateError";
  }
}
