
getUserData()
.then( function() {

console.log("profile-profile")
console.log(loggedUser)

document.getElementById("keyb_p1_up").value = loggedUser.keymap[0]
document.getElementById("keyb_p1_dn").value = loggedUser.keymap[1]
document.getElementById("keyb_p2_up").value = loggedUser.keymap[2]
document.getElementById("keyb_p2_dn").value = loggedUser.keymap[3]

document.getElementById("keybinds_submitbutton").addEventListener("click", (e) => {
console.log('clicked Save')
	e.preventDefault();

	const newKeymap = document.getElementById("keyb_p1_up").value
	+ document.getElementById("keyb_p1_dn").value
	+ document.getElementById("keyb_p2_up").value
	+ document.getElementById("keyb_p2_dn").value

	fetch(`http://localhost:3002/api/user/updatekeybinds/${newKeymap}`, {
		method: 'PUT',
		credentials: 'include'
	})
	.then( function(response) { 
		if (response.status == 200)
			return response.json()
		else alert("User data error")
	})
	.then( function(data) {
console.log("UserData")
		loggedUser.keymap = data.keymap;
	})
	.catch( function(error) { console.error(error) })



})




}

)
