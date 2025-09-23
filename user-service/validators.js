// validators.js


exports.validateEmail = function(email) {

return true

    return String(email)
        .toLowerCase()
        .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};


exports.validateUserName = function(userName) {

    if (userName.length == 0)
        return false
    if (userName.length > 32)
        return false
    return true	
};


exports.validatePassword = function(password) {

    if (password == null)
        return true
    if (password.length > 64)
        return false
    if (password.length == 0)
        return false

    return true
};
