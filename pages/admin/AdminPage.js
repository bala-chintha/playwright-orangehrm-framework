const { BasePage } = require('../BasePage');

const PAGE_URL = '/web/index.php/admin/viewSystemUsers';

class AdminPage extends BasePage {

    constructor(page) {
        super(page);
        this.addButton = this.page.getByRole('button', { name: 'Add' });
        this.searchButton = this.page.getByRole('button', { name: 'Search' });
        this.resetButton = this.page.getByRole('button', { name: 'Reset' });
        this.usernameInput = this.page.locator('.oxd-table-filter-area .oxd-input').first();
        this.userTable = this.page.locator('.oxd-table-body');
        this.tableRows = page.locator('.oxd-table-body [role="row"]');
        this.noRecordsText = page.locator('span.oxd-text.oxd-text--span', { hasText: 'No Records Found' });
        this.deleteConfirm = this.page.getByRole('button', { name: 'Yes, Delete' });
    }

    async goto() {
        await this.navigate(PAGE_URL);
        await this.waitForElement(this.addButton);
    }

    async clickAdd() {
        await this.addButton.click();
        await this.page.waitForURL('**/saveSystemUser**');
    }

    async waitForSearchResults() {
        await this.page.waitForLoadState('networkidle');
        await Promise.any([
            this.tableRows.first().waitFor({ state: 'visible' }),
            this.noRecordsText.waitFor({ state: 'visible' }),
        ]);
    }

    async searchByUsername(username) {
        await this.usernameInput.fill('');
        await this.usernameInput.fill(username);
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
        await this.page.waitForURL('**/saveSystemUser**');
    }

    async clickDeleteOnRow(index = 0) {
        const deleteButton = this.tableRows.nth(index).getByRole('button').nth(0);
        await deleteButton.click();
        await this.waitForElement(this.deleteConfirm);
    }

    async confirmDelete() {
        await this.deleteConfirm.click();
        await this.waitForElement(this.noRecordsText);
    }
}

module.exports = { AdminPage };