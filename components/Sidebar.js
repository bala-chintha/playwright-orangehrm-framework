class Sidebar {

    constructor(page) {
        this.page = page;
        this.menu = {
            admin: {
                link: page.getByRole('link', { name: 'Admin' }),
                url: '**/viewSystemUsers**',
            },
            pim: {
                link: page.getByRole('link', { name: 'PIM' }),
                url: '**/viewEmployeeList**',
            },
            leave: {
                link: page.getByRole('link', { name: 'Leave' }),
                url: '**/viewLeaveList**',
            },
            time: {
                link: page.getByRole('link', { name: 'Time' }),
                url: '**/viewEmployeeTimesheet**',
            },
            recruitment: {
                link: page.getByRole('link', { name: 'Recruitment' }),
                url: '**/viewCandidates**',
            },
            myInfo: {
                link: page.getByRole('link', { name: 'My Info' }),
                url: '**/viewPersonalDetails**',
            },
            performance: {
                link: page.getByRole('link', { name: 'Performance' }),
                url: '**/searchEvaluatePerformanceReview**',
            },
            dashboard: {
                link: page.getByRole('link', { name: 'Dashboard' }),
                url: '**/dashboard**',
            },
            directory: {
                link: page.getByRole('link', { name: 'Directory' }),
                url: '**/viewDirectory**',
            },
            buzz: {
                link: page.getByRole('link', { name: 'Buzz' }),
                url: '**/viewBuzz**',
            },
        };
    }

    async navigateTo(module) {
        const menuItem = this.menu[module];
        if (!menuItem) {
            throw new Error(
                `Sidebar: invalid module "${module}". ` +
                `Available: ${Object.keys(this.menu).join(', ')}`
            );
        }
        await menuItem.link.click();
        await this.page.waitForURL(menuItem.url);
    }
}

module.exports = { Sidebar };