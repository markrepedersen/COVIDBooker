import {
  Page,
  elementIsVisible,
  findBy,
  log,
  validate,
  WaitCondition,
  Button,
  elementIsClickable,
} from "automark";
import {BookAppointmentPage} from "./BookAppointmentPage";

@log
@validate
export class SchedulePage extends Page {
  @findBy("#btnBookAppointment")
  protected bookAptmtButton!: Button;

  public loadCondition(): WaitCondition {
    return elementIsClickable(() => this.bookAptmtButton);
  }

  public async goToBookWorkoutPage(): Promise<BookAppointmentPage> {
    await (await this.browser.driver).sleep(2000);
    await this.bookAptmtButton.click();
    return await this.browser.waitUntilPageHasLoaded(BookAppointmentPage);
  }
}
