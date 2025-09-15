
getUserData()
.then( function() {

console.log("userprofile")
console.log(loggedUser)

	const userName = location.href.substring(location.href.lastIndexOf('/') + 1);
console.log(userName)

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
			if (data.id == undefined) {
				location.href = '/';
				return
			}
document.getElementById("username_label").textContent = data.name
document.getElementById("rank_label").textContent = "Rank: " + data.rank


		})
		.catch( function(error) { console.error(error)
			location.href = '/';
		})

//	alert("huhuhuhaha")


})
