const { BasePage } = require('../BasePage');

class ApplyLeavePage extends BasePage {

    constructor(page) {
        super(page);
        this.leaveTypeDropdown = this.page.locator('.oxd-select-text').first();
        this.fromDateInput = this.page.locator('input[placeholder="yyyy-dd-mm"]').nth(0);
        this.toDateInput = this.page.locator('input[placeholder="yyyy-dd-mm"]').nth(1);
        this.applyButton = this.page.getByRole('button', { name: /apply/i });
        this.cancelButton = this.page.getByRole('button', { name: 'Cancel' });
        this.successToast = this.page.locator('.oxd-toast--success');
    }

    async isLoaded() {
        await this.waitForElement(this.leaveTypeDropdown);
        return true;
    }

    async selectLeaveType(leaveType) {
        await this.leaveTypeDropdown.click();
        await this.page.getByRole('option', { name: leaveType }).click();
    }

    async setFromDate(date) {
        await this.fromDateInput.clear();
        await this.fromDateInput.fill(date);
        await this.fromDateInput.press('Enter');
    }

    async setToDate(date) {
        await this.toDateInput.clear();
        await this.toDateInput.fill(date);
        await this.toDateInput.press('Enter');
    }

    async apply() {
        await this.applyButton.click();
        await this.waitForElement(this.successToast);
    }

    async cancel() {
        await this.cancelButton.click();
        await this.page.waitForURL('**/viewLeaveList**');
    }

    async getSuccessMessage() {
        await this.waitForElement(this.successToast);
        return this.successToast.innerText();
    }
}

module.exports = { ApplyLeavePage };