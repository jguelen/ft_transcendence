

getUserData()
.then( function() {

document.getElementById('searchUserText').addEventListener('keydown', (event) => {

	if (event.key === 'Enter') {
console.log('Enter key pressed!');

		const userName = document.getElementById('searchUserText').value.trim()

		fetch(`http://localhost:3002/api/user/getbyname/${userName}`, {
			method: 'GET',
			credentials: 'include',
		})
		.then( function(response) {
			if (response.status == 200)
				return response.json()
			else return null
		})
		.then( function(data) {
console.log(data)
			if (loggedUser.name == data.name) {
				location.href = '/';
				return
			}
			putResult(data)
		})
		.catch( function(error) { console.error(error) })
	}
});



})
.catch( function(error) { console.error(error) })


function putResult(userData) {
	
	if (userData.id == null) {
		document.getElementById('searchResult').textContent = "User not found."
		return
	}

	document.getElementById('searchResult').innerHTML = `<a href="/userprofile/${userData.name}">${userData.name}</a>  <button id="askfriendship">Ask for friend</button>`

	document.getElementById('askfriendship').addEventListener('click', askFriend)

}

function askFriend(event) {
	
	event.preventDefault();

//	alert("huhuhuhihi")





}
