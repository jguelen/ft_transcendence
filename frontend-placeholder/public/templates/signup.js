console.log("huhuhuhihi");

// document.getElementById('uuu').addEventListener('click', function(event) {
// //alert("huhuhuhuhuhu");
// console.log("scriptButton was clicked");
// })

/*
document.getElementById('suf_submitbutton').addEventListener('click', function(event) {
//alert("huhuhuhuhuhu");
console.log("submitButton was clicked");

  event.preventDefault();

})
*/

document.getElementById('suf_submitbutton').addEventListener('click', function(event) {
//alert("huhuhuhuhuhu");
// console.log("scriptButton was clicked");

  event.preventDefault();
  console.log('text was inputed');

	var userName = document.getElementById('userNameInput').value; userName = userName.trim();
	var userEmail = document.getElementById('userEmailInput').value; userEmail = userEmail.trim();
	var password = document.getElementById('passwordInput').value; password = password.trim();

	let validLogin = true;
	// if (userName == "") validLogin = false;
	// if (userName.length > 32 ) validLogin = false;
	// if (password.length > 24 ) validLogin = false;

	if (validLogin) {
		fetch('http://localhost:3001/api/auth/signup', {
			method: 'POST',
			credentials: 'include', // This sends cookies and other credentials
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify( {name:userName, email:userEmail, password:password})
		})
		.then( function(response) {
			if (response.status != 200)
				return response.json()
			else return null
		})
		.then( function(data) {
console.log(data)
			if (data)
				alert(data.msg)
			else
				location.href = '/';
		})
		.catch( function(error) { console.error(error) });

	} else alert("Et bah non, le nom ou le mot de pass est invalide !");

}
)
