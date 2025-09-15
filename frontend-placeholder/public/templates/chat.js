

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
		//.catch( function(error) { console.error(error) })

	}
});

	refresh_yourfriendshiprequests()



})
.catch( function(error) { console.error(error) })


function putResult(userData) {
	
	if (userData.id == null) {
		document.getElementById('searchResult').textContent = "User not found."
		return
	}

	document.getElementById('searchResult').innerHTML = `<a href="/userprofile/${userData.name}">${userData.name}</a>  <button id="askfriendshipBtn">Ask for friend</button>`

	const askfriendshipBtn = document.getElementById('askfriendshipBtn')
	askfriendshipBtn.setAttribute('requserid',userData.id);
	askfriendshipBtn.addEventListener('click', askFriend)

}

function askFriend(event) {
	
	event.preventDefault();

	const askfriendshipBtn = document.getElementById('askfriendshipBtn')
	const requestedUserId = askfriendshipBtn.getAttribute('requserid');
//alert(requestedUserId)


		fetch(`http://localhost:3002/api/user/requestfriendship/${requestedUserId}`, {
			method: 'PUT',
			credentials: 'include'
		})
		.then( function(response) {
console.log(response)
			askfriendshipBtn.remove()

		})
		.catch( function(error) { console.error(error) })

}


function refresh_yourfriendshiprequests(event) {
	console.log("refresh_yourfriendshiprequests")

		fetch(`http://localhost:3002/api/user/getyourfriendshiprequests`, {
			method: 'GET',
			credentials: 'include'
		})
		.then( function(response) {
			if (response.status == 200)
				return response.json()
			else return null
		})
		.then( function(data) {
//console.log(data)
			if (data.length)
				populate_yourfriendshiprequests(data)

		})
		.catch( function(error) { console.error(error) })

}


function populate_yourfriendshiprequests(array) {

	const frreqbyyou = document.getElementById('frreqbyyou')
	const statusText = ['pending', 'refused']

	array.forEach( (item) => {
console.log(item)
		let new_y_fr = document.createElement("div");
		var innerHTML = `<a href="/userprofile/${item.name}">${item.name}</a> Status:`
		innerHTML = innerHTML + statusText[item.declined]


		innerHTML = innerHTML + ` <button>Remove</button>`
		new_y_fr.innerHTML = innerHTML

		frreqbyyou.appendChild(new_y_fr)

	})

}

