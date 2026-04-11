const { BasePage } = require('../BasePage');

class AddEmployeePage extends BasePage {

    constructor(page) {
        super(page);
        this.firstNameInput = this.page.locator('input[name="firstName"]');
        this.middleNameInput = this.page.locator('input[name="middleName"]');
        this.lastNameInput = this.page.locator('input[name="lastName"]');
        this.saveButton = this.page.getByRole('button', { name: 'Save' });
        this.cancelButton = this.page.getByRole('button', { name: 'Cancel' });
        this.successToast = this.page.locator('.oxd-toast--success');
    }

    async isLoaded() {
        await this.waitForElement(this.firstNameInput);
        return true;
    }

    async fillDetails(firstName, middleName, lastName) {
        await this.firstNameInput.clear();
        await this.firstNameInput.fill(firstName);
        await this.middleNameInput.clear();
        await this.middleNameInput.fill(middleName);
        await this.lastNameInput.clear();
        await this.lastNameInput.fill(lastName);
    }

    async save() {
        await this.saveButton.click();
        await this.waitForElement(this.successToast);
    }

    async getSuccessMessage() {
        await this.waitForElement(this.successToast);
        return this.successToast.innerText();
    }

    async cancel() {
        await this.cancelButton.click();
        await this.page.waitForURL('**/viewEmployeeList**');
    }
}

module.exports = { AddEmployeePage };