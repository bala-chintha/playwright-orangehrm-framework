const getFutureWorkingDate = (workingDaysFromNow) => {
    const date = new Date();
    let counted = 0;
    while (counted < workingDaysFromNow) {
        date.setDate(date.getDate() + 1);
        const day = date.getDay();
        if (day !== 0 && day !== 6) counted++;
    }
    const yyyy = date.getFullYear();
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    return `${yyyy}-${dd}-${mm}`;
};

const LEAVE_FIXTURES = {
    LEAVE_TYPE: 'CAN - Personal',
    APPLY_DATE: getFutureWorkingDate(45),
    DELETE_DATE: getFutureWorkingDate(60),
};

const INVALID_LEAVE_FIXTURES = {
    NONEXISTENT_TYPE: 'InvalidLeaveType000',
};

module.exports = {
    LEAVE_FIXTURES,
    INVALID_LEAVE_FIXTURES,
};