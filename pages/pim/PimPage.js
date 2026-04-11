const { BasePage } = require('../BasePage');

const PAGE_URL = '/web/index.php/pim/viewEmployeeList';

class PimPage extends BasePage {

    constructor(page) {
        super(page);
        this.addButton = this.page.getByRole('button', { name: 'Add' });
        this.searchButton = this.page.getByRole('button', { name: 'Search' });
        this.resetButton = this.page.getByRole('button', { name: 'Reset' });
        this.employeeNameInput = this.page.getByPlaceholder('Type for hints...').first();
        this.employeeTable = this.page.locator('.oxd-table-body');
        this.tableRows = this.page.locator('.oxd-table-row--clickable');
        this.noRecordsText = this.page.locator('.oxd-text--span').filter({ hasText: 'No Records Found' });
        this.deleteConfirmButton = this.page.getByRole('button', { name: 'Yes, Delete' });
    }

    async goto() {
        await this.navigate(PAGE_URL);
        await this.waitForElement(this.addButton);
    }

    async clickAdd() {
        await this.addButton.click();
        await this.page.waitForURL(/addEmployee/);
    }

    async waitForSearchResults() {
        await Promise.any([
            this.tableRows.first().waitFor({ state: 'visible' }),
            this.noRecordsText.waitFor({ state: 'visible' }),
        ]);
    }

    async searchByName(name) {
        await this.employeeNameInput.fill(name);
        await this.page.waitForTimeout(800);
        await this.employeeNameInput.press('Escape');
        await this.searchButton.click();
        await this.waitForSearchResults();
    }
    async resetSearch() {
        await this.resetButton.click();
        await this.waitForSearchResults();
    }

    async getRowCount() {
        await this.waitForSearchResults();
        return this.tableRows.count();
    }

    async isNoRecordsFound() {
        return this.noRecordsText.isVisible();
    }

    async clickEditOnRow(index = 0) {
        const editButton = this.tableRows.nth(index).getByRole('button').nth(1);
        await editButton.click();
        await this.page.waitForURL('**/editEmployee**');
    }

    async clickDeleteOnRow(index = 0) {
        const deleteButton = this.tableRows.nth(index).getByRole('button').nth(0);
        await deleteButton.click();
        await this.waitForElement(this.deleteConfirmButton);
    }

    async confirmDelete() {
        await this.deleteConfirmButton.click();
        await this.waitForElement(this.employeeTable);
    }
}

module.exports = { PimPage };
