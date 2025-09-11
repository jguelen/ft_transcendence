

getUserData()
.then( function() {

console.log("profile-account")
console.log(loggedUser)

	document.getElementById("display_name").value = loggedUser.name


	document.getElementById("chgname_submitbutton").addEventListener("click", (e) => {
console.log('clicked changenamebtn')
	e.preventDefault();

	const newUserName = document.getElementById("display_name").value

	fetch(`http://localhost:3002/api/user/updateusername/${newUserName}`, {
		method: 'PUT',
		credentials: 'include'
	})
	.then( function(response) { 
		if (response.status == 200)
			return response.json()
		else alert("User data error")
	})
	.then( function(returnedData) {
console.log("returnedData")
console.log(returnedData)
		if (returnedData.name == "") {
			alert("username already exist")
			document.getElementById("display_name").value = loggedUser.name
		}
		else {
			loggedUser.name = returnedData.name
			document.getElementById("display_name").value = returnedData.name
		}
//		loggedUser = data;
	})
	.catch( function(error) { console.error(error) })


	})

	document.getElementById("chgpw_submitbutton").addEventListener("click", (e) => {
console.log('changepwbtn')
		e.preventDefault();

		const currentPw = document.getElementById("input_pw").value
		const newPw = document.getElementById("input_newpw").value

		fetch(`http://localhost:3002/api/user/updatepw/${currentPw}/${newPw}`, {
			method: 'PUT',
			credentials: 'include'
		})
		.then( function(response) { 
			alert(response.status)
			if (response.status == 401)
				return alert("Password mismatch")
			if (response.status == 200)
				return alert("Password changed")
			alert("Cannot change password")
		})
		.catch( function(error) { console.error(error) })



	})


})
