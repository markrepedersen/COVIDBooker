import {
  Page,
  elementIsVisible,
  findBy,
  log,
  validate,
  WaitCondition,
  Button,
  TextInput,
  WebComponent,
} from "automark";
import {
  UnavailableTimeError,
  DuplicateBookingError,
  UnavailableDateError,
} from "./booking_error";

@log
@validate
export class BookAppointmentPage extends Page {
  @findBy(`//*[@id="totalBookings"]`)
  protected totalBookings!: WebComponent;

  @findBy("#ddlDays")
  protected dateSelector!: Button;

  public loadCondition(): WaitCondition {
    return elementIsVisible(() => this.dateSelector);
  }

  public async hasBookings(): Promise<boolean> {
    return (await this.totalBookings.getText()) == "0";
  }

  private async findDate(month: string, day: string): Promise<WebComponent> {
    return this.browser.findElement(
      `//option[contains(text(), "${month}") and contains(text(), "${day}")]`
    );
  }

  public async selectDate(month: string, day: string) {
    await this.dateSelector.click();
    await (await this.findDate(month, day)).click();
  }

  private async findTime(time: string): Promise<TextInput> {
    return this.browser.findElement(
      `//div[@id="pnlUserBookGroupFitness"]//td[contains(@style, "text-align:left")]//span[contains(text(), "${time}-")]/ancestor::td/following-sibling::td//input`,
      TextInput
    );
  }

  public async selectTime(time: string) {
    try {
      let input: TextInput = await this.findTime(time);
      let value: string = await input.getElementAttribute("value");

      if (value.includes("Insufficient")) {
        throw new UnavailableTimeError(time);
      } else if (value.includes("Cancel Booked")) {
        throw new DuplicateBookingError();
      } else {
        await input.click();
      }
    } catch (e) {
      if (e instanceof DuplicateBookingError) {
        throw e;
      } else {
        throw new UnavailableTimeError(time);
      }
    }
  }

  /***
   * Book a workout from a given date.
   ***/
  public async bookWorkout(date: Date) {
    let day = date.getDate().toString();
    let month = date.toLocaleString("en-us", {month: "long"});
    let time = date.toLocaleTimeString("en-us", {
      hour: "2-digit",
      minute: "2-digit",
    });

    try {
      await this.selectDate(month, day);
    } catch (e) {
      throw new UnavailableDateError(date);
    }

    try {
      await this.selectTime(time);
    } catch (e) {
      throw new UnavailableTimeError(time);
    }
  }
}
