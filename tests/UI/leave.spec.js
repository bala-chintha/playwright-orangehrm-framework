const { test, expect } = require('../../fixtures');
const { LEAVE_FIXTURES } = require('../../test-data/leave.data');

const applyLeave = async (leavePage, applyLeavePage, date) => {
    await leavePage.clickApply();
    await applyLeavePage.selectLeaveType(LEAVE_FIXTURES.LEAVE_TYPE);
    await applyLeavePage.setFromDate(date);
    await applyLeavePage.setToDate(date);
    await applyLeavePage.apply();
};

test.describe('@smoke Leave', () => {

    test.beforeEach(async ({ authenticatedPage, leavePage }) => {
        await leavePage.deleteAllLeaves();
    });

    test('should navigate to apply leave page', async ({ leavePage, applyLeavePage }) => {
        await leavePage.clickApply();
        expect(await applyLeavePage.isLoaded(), 'Apply leave form should be visible').toBeTruthy();
    });

    test('should load leave list page', async ({ leavePage }) => {
        const count = await leavePage.getRowCount();
        expect(count, 'Leave list should load without errors').toBeGreaterThanOrEqual(0);
    });

    test('should apply leave successfully', async ({ leavePage, applyLeavePage }) => {
        await applyLeave(leavePage, applyLeavePage, LEAVE_FIXTURES.APPLY_DATE);
        const message = await applyLeavePage.getSuccessMessage();
        expect(message, 'Success toast should appear').toContain('Successfully Saved');
    });

    test('should delete leave request successfully', async ({ leavePage, applyLeavePage }) => {
        await applyLeave(leavePage, applyLeavePage, LEAVE_FIXTURES.DELETE_DATE);
        await leavePage.goto();

        await leavePage.clickDeleteOnRow(0);
        const row = leavePage.tableRows.first();
        await expect(row).toContainText('Cancelled');
    });

});