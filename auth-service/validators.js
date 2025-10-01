// validators.js


exports.validateEmail = function(email) {
    const pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
    return pattern.test(email.toLowerCase())
}


exports.validateUserName = function(userName) {

    if (userName.includes('@'))
        return false
    if (userName.length <= 3)
        return false
    if (userName.length >= 18)
        return false
    return true	
}


exports.validatePassword = function(password) {

	if (password.length < 12) {
		return false;
	}
	if (!/[a-z]/.test(password)) {
		return false;
	}
	if (!/[A-Z]/.test(password)) {
		return false;
	}
	if (!/[0-9]/.test(password)) {
		return false;
	}
	if (!/[!@#$%^&*_]/.test(password)) {
    	return false;
	}
	return true;
}
