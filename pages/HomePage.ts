import {
  Page,
  elementIsVisible,
  findBy,
  log,
  validate,
  WaitCondition,
  Button,
} from "automark";
import {LoginPage} from "./LoginPage";

@log
@validate
export class HomePage extends Page {
  public static LINK: string = "https://www.trevorlindenfitness.com/";

  @findBy("//div//li//a[contains(text(), 'login')]")
  protected loginButton!: Button;

  public loadCondition(): WaitCondition {
    return elementIsVisible(() => this.loginButton);
  }

  public async goToLogin(): Promise<LoginPage> {
    await this.loginButton.click();
    return await this.browser.waitUntilPageHasLoaded(LoginPage);
  }
}
