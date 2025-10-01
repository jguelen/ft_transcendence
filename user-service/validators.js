// validators.js


exports.validateEmail = function(email) {
    const pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    return pattern.test(email.toLowerCase());
}


exports.validateUserName = function(userName) {

console.log(userName, '1')
    if (userName.includes('@'))
        return false
console.log(userName, '2')
    if (userName.length <= 3)
        return false
console.log(userName, '3')
    if (userName.length >= 18)
        return false
console.log(userName, '4')
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
