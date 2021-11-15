// based on this comment: https://stackoverflow.com/questions/8532406/create-a-random-token-in-javascript-based-on-user-details
let rand = () => {
    return Math.random().toString(36).substr(2);
};

exports.genToken = function() {
    return rand() + rand() + rand();
};