import {
  Page,
  elementIsVisible,
  findBy,
  validate,
  WaitCondition,
  Button,
  TextInput,
  WebComponent,
} from "automark";
import {
  UnavailableTimeError,
  DuplicateBookingError,
  InsufficientCreditsAvailableError,
  formatDate,
} from "./booking_error";

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
    let date = await this.findDate(month, day);

    await this.dateSelector.click();
    await date.click();
    await this.browser.waitForElementToHaveAttributes(
      date.selector,
      "selected"
    );
  }

  private async findTime(time: string): Promise<TextInput> {
    return this.browser.findElement(
      `//div[@id="pnlUserBookGroupFitness"]//td[contains(@style, "text-align:left")]//span[contains(text(), "${time}-")]/ancestor::td/following-sibling::td//input`,
      TextInput
    );
  }

  public async selectTime(date: Date) {
    let time = date.toLocaleTimeString("en-us", {
      hour: "numeric",
      minute: "2-digit",
    });
    let dateString = formatDate(date);
    try {
      let input: TextInput = await this.findTime(time);
      let value: string = await input.getElementAttribute("value");

      if (value.includes("Insufficient")) {
        throw new InsufficientCreditsAvailableError(date);
      } else if (value.includes("Cancel Booked")) {
        throw new DuplicateBookingError(date);
      } else {
        await input.click();
        console.log(`Successfully booked appointment for '${dateString}'.`);
        await this.browser.waitFor(
          async (): Promise<boolean> => {
            let booking = await this.findTime(time);
            let value = await booking.getElementAttribute("value");
            return value.includes("Cancel Booked");
          }
        );
      }
    } catch (e) {
      if (
        e instanceof DuplicateBookingError ||
        e instanceof InsufficientCreditsAvailableError
      ) {
        throw e;
      } else {
        throw new UnavailableTimeError(date);
      }
    }
  }

  /***
   * Book a workout from a given date.
   ***/
  public async bookWorkout(dates: Array<Date>) {
    for (let date of dates) {
      let day = date.getDate().toString();
      let month = date.toLocaleString("en-us", {month: "long"});

      await this.selectDate(month, day).catch((e) => console.log(e));
      await this.selectTime(date).catch((e) => console.log(e));
    }
  }
}
