

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
		
		})
		.catch( function(error) { console.error(error) })
	}
});



})
.catch( function(error) { console.error(error) })


