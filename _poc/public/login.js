//console.log("huhuuhaha");

console.log("huhuhuhihi");

document.getElementById('sbutton').addEventListener('click', function(event) {
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

	if (validLogin) {
		fetch('/user', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify( {useremail:userEmail, password:password} )
		})
		.then( function(response) {return response.text();})
		.then( function(msg) { 
			if(msg != "") alert(msg); else location.href = '/';
		})
		.catch( function(error) { console.error(error); });

	} else alert("Et bah non, le nom ou le mot de pass est invalide !");

}
)
