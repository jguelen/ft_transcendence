
getUserData()
.then( function() {

console.log("profile-profile")
console.log(loggedUser)

document.getElementById("username_label").textContent = loggedUser.name

document.getElementById("rank_label").textContent = "Rank: " + loggedUser.rank

}

)

