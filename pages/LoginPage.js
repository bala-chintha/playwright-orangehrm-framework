const { BasePage } = require('./BasePage');

const PAGE_URL = '/web/index.php/auth/login';

class LoginPage extends BasePage {

    constructor(page) {
        super(page);
        this.usernameInput = this.page.getByPlaceholder('Username');
        this.passwordInput = this.page.getByPlaceholder('Password');
        this.loginButton = this.page.getByRole('button', { name: /login/i });
        this.errorAlert = this.page.locator('.oxd-alert-content-text');
        this.fieldError = this.page.locator('.oxd-input-field-error-message').first();
    }
    
    async goto() {
        await this.navigate(PAGE_URL);
        await this.waitForElement(this.usernameInput);
    }

    async login(username, password) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async getErrorAlertText() {
        await this.errorAlert.waitFor({ state: 'visible' });
        return this.errorAlert.innerText();
    }

    async getValidationErrorText() {
        await this.fieldError.waitFor({ state: 'visible' });
        return this.fieldError.innerText();
    }
}

module.exports = { LoginPage };