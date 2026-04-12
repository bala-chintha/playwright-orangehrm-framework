const { BasePage } = require('../BasePage');

const PAGE_URL = '/web/index.php/leave/viewMyLeaveList';

class LeavePage extends BasePage {

    constructor(page) {
        super(page);
        this.applyLeaveLink = this.page.getByRole('link', { name: 'Apply' });
        this.leaveTable = this.page.locator('.oxd-table-body');
        this.tableRows = page.locator('.oxd-table-body [role="row"]');
        this.noRecordsText = this.page.getByText('No Records Found');
        this.successToast = this.page.locator('.oxd-toast--success');
        this.cancelButton = this.page.getByRole('button', { name: 'Cancel' });
    }

    async goto() {
        await this.navigate(PAGE_URL);
        await this.waitForElement(this.leaveTable);
    }

    async clickApply() {
        await this.applyLeaveLink.click();
        await this.page.waitForURL('**/applyLeave**');
    }

    async getRowCount() {
        await this.waitForElement(this.leaveTable);
        return this.tableRows.count();
    }

    async isNoRecordsFound() {
        return this.noRecordsText.isVisible();
    }

    async clickDeleteOnRow(index = 0) {
        const row = this.tableRows.filter({ has: this.cancelButton }).first();
        await row.getByRole('button', { name: 'Cancel' }).click();
        await this.waitForElement(this.successToast);
    }

    async deleteAllLeaves() {
        await this.goto();

        while (await this.page.getByRole('button', { name: 'Cancel' }).count() > 0) {
            const cancelBtn = this.page.getByRole('button', { name: 'Cancel' }).first();
            await cancelBtn.click();
            await this.waitForElement(this.successToast);
            await this.page.waitForTimeout(500); // allow UI update
        }
    }
}

module.exports = { LeavePage };