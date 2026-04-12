const { BasePage } = require('../BasePage');

class AddUserPage extends BasePage {

    constructor(page) {
        super(page);
        this.userRoleDropdown = this.page.locator('.oxd-select-text').nth(0);
        this.employeeNameInput = this.page.locator('.oxd-autocomplete-text-input input');
        this.statusDropdown = this.page.locator('.oxd-select-text').nth(1);
        this.usernameInput = this.page.locator('input[autocomplete="off"]').nth(0);
        this.passwordInput = this.page.locator('input[type="password"]').nth(0);
        this.confirmPassword = this.page.locator('input[type="password"]').nth(1);
        this.saveButton = this.page.getByRole('button', { name: 'Save' });
        this.successToast = this.page.locator('.oxd-toast--success');
        this.employeeSuggestions = this.page.locator('.oxd-autocomplete-dropdown');
        this.employeeOptions = this.page.locator('.oxd-autocomplete-option');
    }

    async isLoaded() {
        await this.waitForElement(this.usernameInput);
        return true;
    }

    async selectUserRole(role) {
        await this.userRoleDropdown.click();
        await this.page.getByRole('option', { name: role }).click();
    }

    async selectStatus(status) {
        await this.statusDropdown.click();
        await this.page.getByRole('option', { name: status }).click();
    }

    async fillEmployeeName(name) {
        await this.employeeNameInput.fill('');
        await this.employeeNameInput.type(name, { delay: 100 });
        await this.employeeSuggestions.waitFor({ state: 'visible' });
        await this.employeeOptions.first().waitFor();
        await this.employeeOptions.filter({ hasText: name }).first().click();
    }

    async fillUsername(username) {
        await this.usernameInput.fill(username);
    }

    async fillPassword(password) {
        await this.passwordInput.fill(password);
        await this.confirmPassword.fill(password);
    }

    async save() {
        await this.saveButton.click();
        await this.waitForElement(this.successToast);
    }

    async getSuccessMessage() {
        await this.waitForElement(this.successToast);
        return this.successToast.innerText();
    }
}

module.exports = { AddUserPage };