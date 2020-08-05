import {Chrome} from "automark";
import {HomePage} from "./pages";
import {readFileSync, existsSync} from "fs";
import {assert} from "console";

export type WeekDay = {
  day: string;
  time: number;
};

type Config = {
  username: string;
  password: string;
  date: {
    recurring: boolean;
    dates: Array<WeekDay>;
  };
};

export class Runner {
  public chrome!: Chrome;
  public config!: Config;

  public constructor() {
    this.chrome = new Chrome({headless: true});
    this.config = this.loadConfig();
  }

  private loadConfig(): Config {
    let path: string = `${__dirname}/config.json`;
    if (!existsSync(path)) {
      throw new Error("No 'config.json' file given.");
    }
    return JSON.parse(readFileSync(path, "utf8"));
  }

  private async goToHomePage(): Promise<HomePage> {
    await this.chrome.navigate(HomePage.LINK);
    return await this.chrome.waitUntilPageHasLoaded(HomePage);
  }

  /**
   * Converts the days of the week specified in the config into Date objects.
   **/
  private getDates(days: Array<WeekDay>): Array<Date> {
    let dates = [];
    let curr = new Date();
    let first = curr.getDate();

    for (let i = 0; i < 7; i++) {
      let next = new Date(curr.getTime());
      next.setDate(first + i);
      let dayOfWeek = next.toLocaleDateString("en-us", {weekday: "long"});
      let weekDay = days.find((weekday: WeekDay) => weekday.day == dayOfWeek);

      if (weekDay) {
        next.setHours(weekDay.time, 0);
        dates.push(next);
      }
    }

    assert(
      dates.length > 0,
      "There was a problem parsing the dates. Please verify correct usage."
    );

    return dates;
  }

  /**
   * Books the workout(s) for the specified date(s).
   **/
  public async book() {
    let dates = this.getDates(this.config.date.dates);

    console.log("Scheduling appointments for the following days: ");
    dates.forEach((d) =>
      console.log(d.toLocaleString("en-us", {weekday: "long"}))
    );

    let homePage = await this.goToHomePage();
    let loginPage = await homePage.goToLogin();
    let schedulePage = await loginPage.login(
      this.config.username,
      this.config.password
    );
    let bookAppointmentPage = await schedulePage.goToBookWorkoutPage();

    await bookAppointmentPage.bookWorkout(dates);

    this.chrome.quit();
  }
}

new Runner().book();
