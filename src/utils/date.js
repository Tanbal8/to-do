const getDate = () => {
    const [month, day, year] = new Date().toLocaleDateString('en-US').split('/');
    return {
        year,
        month,
        day,
    };
}

const compareDates = (date1, date2) => {
    if (date1.year !== date2.year) return date1.year - date2.year;
    if (date1.month !== date2.month) return date1.month - date2.month;
    return date1.day - date2.day;
}

export {
    getDate,
    compareDates
};