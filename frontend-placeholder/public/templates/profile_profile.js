
getUserData()
.then( function() {

console.log("profile-profile")
console.log(loggedUser)

	document.getElementById("username_label").textContent = loggedUser.name

	document.getElementById("rank_label").textContent = "Rank: " + loggedUser.rank

	document.getElementById("logoutbtn").addEventListener("click", (e) => {
	console.log('clicked logout')

			fetch(`http://localhost:3001/api/auth/logout`, {
				method: 'DELETE',
				credentials: 'include'
			})
			.then( function(response) { 
				alert(response.status)
				if (response.status == 200) {
					location.href = '/'
				} 
			})
			.catch( function(error) { console.error(error) })

	})

})
