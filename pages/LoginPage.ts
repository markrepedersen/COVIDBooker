import {
  Page,
  elementIsVisible,
  findBy,
  validate,
  WaitCondition,
  Button,
  TextInput,
} from "automark";
import {SchedulePage} from "./SchedulePage";

@validate
export class LoginPage extends Page {
  @findBy("#txtUsername")
  protected usernameInput!: TextInput;

  @findBy("#txtPassword")
  protected passwordInput!: TextInput;

  @findBy("#btnLogin")
  protected loginButton!: Button;

  public loadCondition(): WaitCondition {
    return elementIsVisible(() => this.passwordInput);
  }

  public async login(username: string, pw: string): Promise<SchedulePage> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(pw);
    await this.loginButton.click();
    return await this.browser.waitUntilPageHasLoaded(SchedulePage);
  }
}
