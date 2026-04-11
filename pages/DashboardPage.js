const { BasePage } = require('./BasePage');
const { Sidebar } = require('../components/Sidebar');

const PAGE_URL = '/web/index.php/dashboard/index';

class DashboardPage extends BasePage {

    constructor(page) {
        super(page);
        this.sidebar = new Sidebar(page);
        this.heading = this.page.getByRole('heading', { name: 'Dashboard' });
        this.userDropdown = this.page.locator('.oxd-userdropdown');
        this.userDropdownTab = this.page.locator('.oxd-userdropdown-tab');
    }

    async goto() {
        await this.navigate(PAGE_URL);
        await this.waitForElement(this.heading);
    }

    async getUserName() {
        await this.waitForElement(this.userDropdownTab);
        return this.userDropdownTab.innerText();
    }

    async logout() {
        await this.userDropdown.click();
        await this.page.getByRole('menuitem', { name: 'Logout' }).click();
        await this.page.waitForURL('**/auth/login**');
    }
}

module.exports = { DashboardPage };