
document.getElementById('sif_submitbutton').addEventListener('click', function(event) {
//alert("huhuhuhuhuhu");
// console.log("scriptButton was clicked");

  event.preventDefault();
  console.log('text was inputed');

  var userEmail = document.getElementById('userEmailInput').value; userEmail = userEmail.trim();
  var password = document.getElementById('passwordInput').value; password = password.trim();

	let validLogin = true;
/*	if (userName == "") validLogin = false;
	if (userName.length > 32 ) validLogin = false;
	if (password.length > 24 ) validLogin = false;*/

	if (!validLogin) {
		alert("Et bah non, le nom ou le mot de pass est invalide !")
		return
	}

	fetch('http://localhost:3001/api/auth_login', {
		method: 'POST',
		credentials: 'include',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify( { useremail:userEmail, password:password } )
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
		else {
			location.href = '/';
		} 
	})
	.catch( function(error) { console.error(error) })
})
