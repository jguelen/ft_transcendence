
document.getElementById('sif_submitbutton').addEventListener('click', function(event) {
//alert("huhuhuhuhuhu");
// console.log("scriptButton was clicked");

  event.preventDefault();
  console.log('text was inputed');

  var userLogin = document.getElementById('userLoginInput').value; userLogin = userLogin.trim();
  var password = document.getElementById('passwordInput').value; password = password.trim();

	let validLogin = true;
/*	if (userName == "") validLogin = false;
	if (userName.length > 32 ) validLogin = false;
	if (password.length > 24 ) validLogin = false;*/

	if (!validLogin) {
		alert("Et bah non, le nom ou le mot de pass est invalide !")
		return
	}

	fetch('http://localhost:3001/api/auth/login', {
		method: 'POST',
		credentials: 'include',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify( { userlogin:userLogin, password:password } )
	})
	.then( function(response) {
console.error(response.status )
		if (response.status == 500)
			return response.json()
		if (response.status == 200)
			location.href = '/'
		if (response.status == 401)
			alert("Invalid user or password")
	})
	.then( function(data) {
		if (data.msg)
			location.href = `/error?login-error=${data.msg}`
		else
			location.href = `/error?login-error`
	})
	.catch( function(error) { console.error(error) })
})
