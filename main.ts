import {Chrome} from "automark";
import {HomePage} from "./pages";
import {readFileSync, existsSync} from "fs";

type Settings = {
  username: string;
  password: string;
  dates: Array<Date>;
};

export class Runner {
  public chrome!: Chrome;
  public settings!: Settings;

  public constructor() {
    this.chrome = new Chrome({headless: true});
    this.settings = this.loadSettings();
  }

  private reviver(_: any, value: any) {
    let dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

    if (Array.isArray(value)) {
      return value.map((date: string) => {
        if (dateFormat.test(date)) {
          return new Date(date);
        }
      });
    }

    return value;
  }

  private loadSettings(): Settings {
    let path: string = `${__dirname}/credentials.json`;
    if (!existsSync(path)) {
      throw new Error("No 'credentials.json' file given.");
    }
    return JSON.parse(readFileSync(path, "utf8"), this.reviver);
  }

  private async goToHomePage(): Promise<HomePage> {
    await this.chrome.navigate(HomePage.LINK);
    return await this.chrome.waitUntilPageHasLoaded(HomePage);
  }

  public async book() {
    let homePage = await this.goToHomePage();
    let loginPage = await homePage.goToLogin();
    let schedulePage = await loginPage.login(
      this.settings.username,
      this.settings.password
    );
    let bookAppointmentPage = await schedulePage.goToBookWorkoutPage();
    let testDate = this.settings.dates[0];

    console.log(testDate);

    await bookAppointmentPage.bookWorkout(testDate);
  }
}

new Runner().book();
