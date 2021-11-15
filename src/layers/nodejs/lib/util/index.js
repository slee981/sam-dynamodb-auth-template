// based on this comment: https://stackoverflow.com/questions/8532406/create-a-random-token-in-javascript-based-on-user-details
let rand = () => {
    return Math.random().toString(36).substr(2);
};

exports.genToken = function() {
    return rand() + rand() + rand();
};

exports.addMinutesToTime = (dt, minutes) => {
    const current = dt.getTime();
    // 60 s in a minute, 1000 ms in a second
    const msToAdd = minutes * 60 * 1000;
    return (current + msToAdd)
}

exports.addDaysToTime = (dt, days) => {
    const current = dt.getTime();
    // 24hrs in a day, 60 min in an housr, 60 s in a minute, 1000 ms in a second
    const daysToAdd = days * 24 * 60 * 60 * 1000;
    return (current + daysToAdd)
}