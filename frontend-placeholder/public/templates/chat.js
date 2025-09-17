
var sh_friends = null


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
			putSearchResult(data)
		})
		//.catch( function(error) { console.error(error) })

	}
});

	sh_friends = get_friends()
console.log(sh_friends)

	refresh_yourfriendshiprequests()
	refresh_friendshiprequests()
	refresh_friends()
	refresh_blockeds()
})
.catch( function(error) { console.error(error) })


function putSearchResult(userData) {
	
	if (userData.id == null) {
		document.getElementById('searchResult').textContent = "User not found."
		return
	}


	fetch(`http://localhost:3002/api/user/getrelationship/${userData.id}`, {
		method: 'GET',
		credentials: 'include'
	})
	.then( function(response) {
		if (response.status == 200)
			return response.json()
		else return null
	})
	.then( function(relationship) {

console.log("getrelationship")
console.log(relationship)

const addAskFriendshipButton = (!relationship.isfriend && !relationship.isblockedbyyou && !relationship.hasblockedyou)
const addBlacklistButton = (!relationship.isfriend && !relationship.isblockedbyyou)


innerHTML = `<a href="/userprofile/${userData.name}">${userData.name}</a>`
//isfriend: true, isblockedbyyou: false, hasblockedyou
if (addAskFriendshipButton)
	innerHTML = innerHTML + ` <button id="askfriendshipBtn">Ask for friend</button>`

if (addBlacklistButton)
	innerHTML = innerHTML + ` <button id="blacklistBtn">Block</button>`


document.getElementById('searchResult').innerHTML = innerHTML

if (addAskFriendshipButton) {
	const askfriendshipBtn = document.getElementById('askfriendshipBtn')
	askfriendshipBtn.setAttribute('requserid',userData.id);
	askfriendshipBtn.addEventListener('click', askFriendship)
}

if (addBlacklistButton) {
	const blacklistBtn = document.getElementById('blacklistBtn')
	blacklistBtn.setAttribute('requserid',userData.id);
	blacklistBtn.addEventListener('click', click_blockuser)
}


		})
		.catch( function(error) { console.error(error) })

}

function askFriendship(event) {
	
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

		refresh_yourfriendshiprequests()

	})
	.catch( function(error) { console.error(error) })
}


function refresh_yourfriendshiprequests() {
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

			populate_yourfriendshiprequests(data)

		})
		.catch( function(error) { console.error(error) })

}


function populate_yourfriendshiprequests(array) {

	const frreqbyyou = document.getElementById('frreqbyyou')
	const statusText = ['pending', 'refused']

	while (frreqbyyou.lastElementChild) {
		frreqbyyou.removeChild(frreqbyyou.lastElementChild);
	}


	array.forEach( (item) => {
console.log(item)
		let new_y_fr = document.createElement("div");
		var innerHTML = `<a href="/userprofile/${item.name}">${item.name}</a> Status:`
		innerHTML = innerHTML + statusText[item.declined]

		let buttonIdText = `y${item.requestedId}`
		let buttonHTML = ` <button id="${buttonIdText}">Remove</button>`
		//let newButton = document.createElement("button")

		innerHTML = innerHTML + buttonHTML
		new_y_fr.innerHTML = innerHTML

		frreqbyyou.appendChild(new_y_fr)
		document.getElementById(buttonIdText).addEventListener('click', click_yourfriendshiprequests)

	})

}


function click_yourfriendshiprequests(event) {

	event.preventDefault();

console.log(event.target.id)


	fetch(`http://localhost:3002/api/user/delyourfriendshiprequest/${event.target.id.slice(1)}`, {
		method: 'DELETE',
		credentials: 'include'
	})
	.then( function(response) {
console.log("uuu")

		refresh_yourfriendshiprequests()

	})
	.catch( function(error) { console.error(error) })


}




function refresh_friendshiprequests() {
	console.log("refresh_friendshiprequests")

		fetch(`http://localhost:3002/api/user/getfriendshiprequests`, {
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

			populate_friendshiprequests(data)

		})
		.catch( function(error) { console.error(error) })

}


function populate_friendshiprequests(array) {
console.log("populate_friendshiprequests")
	const frreqtoyou = document.getElementById('frreqtoyou')

	while (frreqtoyou.lastElementChild) {
		frreqtoyou.removeChild(frreqtoyou.lastElementChild);
	}

	array.forEach( (item) => {
console.log(item)

	if (item.declined == 0) {

		let new_y_fr = document.createElement("div");
		var innerHTML = `<a href="/userprofile/${item.name}">${item.name}</a>`

		let abuttonIdText = `a${item.requesterId}`
		let abuttonHTML = ` <button id="${abuttonIdText}">Accept</button>`

		let dbuttonIdText = `d${item.requesterId}`
		let dbuttonHTML = ` <button id="${dbuttonIdText}">decline</button>`
		
		innerHTML = innerHTML + abuttonHTML + dbuttonHTML
		new_y_fr.innerHTML = innerHTML

		frreqtoyou.appendChild(new_y_fr)
		document.getElementById(abuttonIdText).addEventListener('click', click_acceptfriendshiprequests)
		document.getElementById(dbuttonIdText).addEventListener('click', click_declinefriendshiprequests)
	}


	})

}


function click_acceptfriendshiprequests(event) {

	event.preventDefault();

console.log(event.target.id)


		fetch(`http://localhost:3002/api/user/acceptfriendshiprequest/${event.target.id.slice(1)}`, {
			method: 'PUT',
			credentials: 'include'
		})
		.then( function(response) {
			if (response.status == 200) {
				refresh_friendshiprequests()
				refresh_friends()
				return
			}
			else return null
		})
		.catch( function(error) { console.error(error) })

}


function click_declinefriendshiprequests(event) {

	event.preventDefault();

console.log(event.target.id)

		fetch(`http://localhost:3002/api/user/declinefriendshiprequest/${event.target.id.slice(1)}`, {
			method: 'PUT',
			credentials: 'include'
		})
		.then( function(response) {
			if (response.status == 200) {
				refresh_friendshiprequests()
				return
			}
			else return null
		})
		.catch( function(error) { console.error(error) })

}


function refresh_friends() {
	console.log("refresh_friends")

		fetch(`http://localhost:3002/api/user/getfriends`, {
			method: 'GET',
			credentials: 'include'
		})
		.then( function(response) {
			if (response.status == 200)
				return response.json()
			else return null
		})
		.then( function(data) {
console.log(data)

			populate_friends(data)

		})
		.catch( function(error) { console.error(error) })

}

function populate_friends(array) {

	const friends = document.getElementById('friends')

	while (friends.lastElementChild) {
		friends.removeChild(friends.lastElementChild);
	}

	array.forEach( (item) => {
console.log(item)
		let new_fr = document.createElement("div");
		var innerHTML = `<a href="/userprofile/${item.name}">${item.name}</a>`
		
		let buttonIdText = `u${item.id}`
		let buttonHTML = ` <button id="${buttonIdText}">Remove</button>`

		innerHTML = innerHTML + buttonHTML
		new_fr.innerHTML = innerHTML

		friends.appendChild(new_fr)
		document.getElementById(buttonIdText).addEventListener('click', click_unfriend)
	})
}


function click_unfriend(event) {

	event.preventDefault();

console.log(event.target.id)

		fetch(`http://localhost:3002/api/user/unfriend/${event.target.id.slice(1)}`, {
			method: 'DELETE',
			credentials: 'include'
		})
		.then( function(response) {
			if (response.status == 200)
				return refresh_friends()
			else return null
		})
		.catch( function(error) { console.error(error) })


}


function get_friends() {
	console.log("refresh_friends")

		fetch(`http://localhost:3002/api/user/getfriends`, {
			method: 'GET',
			credentials: 'include'
		})
		.then( function(response) {
			if (response.status == 200)
				return response.json()
			else return null
		})
		.then( function(data) {
			return data
		})
		.catch( function(error) { console.error(error) })

	return []
}

function refresh_blockeds() {
console.log("refresh_blockeds")

		fetch(`http://localhost:3002/api/user/getblockeds`, {
			method: 'GET',
			credentials: 'include'
		})
		.then( function(response) {
			if (response.status == 200)
				return response.json()
			else return null
		})
		.then( function(data) {
console.log(data)

			populate_blockeds(data)

		})
		.catch( function(error) { console.error(error) })

}



function populate_blockeds(array) {
console.log("populate_blockeds")
	const blacklist = document.getElementById('blacklist')

	while (blacklist.lastElementChild) {
		blacklist.removeChild(blacklist.lastElementChild);
	}

	array.forEach( (item) => {
console.log(item)
		let new_fr = document.createElement("div");
		var innerHTML = `<a href="/userprofile/${item.name}">${item.name}</a>`
		
		let buttonIdText = `n${item.id}`
		let buttonHTML = ` <button id="${buttonIdText}">Unblock</button>`

		innerHTML = innerHTML + buttonHTML
		new_fr.innerHTML = innerHTML

		blacklist.appendChild(new_fr)
		document.getElementById(buttonIdText).addEventListener('click', click_unblockuser)
	})
}


function click_blockuser(event) {

	event.preventDefault();

console.log(event.target.id)

	const blacklistBtn = document.getElementById('blacklistBtn')
	const requestedUserId = blacklistBtn.getAttribute('requserid');

	fetch(`http://localhost:3002/api/user/block/${requestedUserId}`, {
		method: 'PUT',
		credentials: 'include'
	})
	.then( function(response) {
		if (response.status == 200) {
			const blacklistBtn = document.getElementById('blacklistBtn')
			if (blacklistBtn)
				blacklistBtn.remove()

			return refresh_blockeds()}
		else return null
	})
	.catch( function(error) { console.error(error) })
}


function click_unblockuser(event) {

	event.preventDefault();

console.log(event.target.id)

		fetch(`http://localhost:3002/api/user/unblock/${event.target.id.slice(1)}`, {
			method: 'DELETE',
			credentials: 'include'
		})
		.then( function(response) {
			if (response.status == 200)
				return refresh_blockeds()
			else return null
		})
		.catch( function(error) { console.error(error) })

}
