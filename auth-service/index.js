// npm i fastify @fastify/cookie @fastify/jwt @fastify/oauth2
// npm i bcrypt jsonwebtoken
// npm i @fastify/oauth2


const { USER_SERVICE_URL } = process.env;
if (!USER_SERVICE_URL) {
	throw new Error("Missing USER_SERVICE_URL env var");
}

const fastify = require('fastify')({ logger: false })
const fastify_cookie = require('@fastify/cookie')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fastifyOauth2 = require("@fastify/oauth2");


// Cookies
fastify.register(fastify_cookie, {
  secret: process.env.JWT_SECRET,
  hook: 'preHandler',
})

// OAuth
	const startRedirectPath = `/login/github`;
	const callbackUri = `http://localhost:3001/login/github/callback`;

fastify.register(fastifyOauth2, {
  name: 'githubOAuth2',
  scope: ["user:email", "read:user"],
	credentials: {
	  client: {
		id: process.env.GITHUB_OAUTH_ID,
		secret: process.env.GITHUB_OAUTH_SECRET,
	  },
	  auth: fastifyOauth2.GITHUB_CONFIGURATION,    
	},
	startRedirectPath,
	callbackUri,
});



// Temporary due to CORS sh!te
fastify.addHook('preHandler', (req, res, next) => {
console.log("hohohoho");

	res.header("Access-Control-Allow-Origin", "http://localhost:3000")
	res.header("Access-Control-Allow-Credentials", true)

	const isPreflight = /options/i.test(req.method);
	if (isPreflight) {
		res.header("Access-Control-Allow-Methods", "GET, PUT, DELETE, POST, OPTIONS");
		res.header("Access-Control-Allow-Headers", 'Content-Type, Authorization');
		return res.send();
	}
	return next()
})



async function getGitHubUserDetails(token) {

	var res = await fetch("https://api.github.com/user", {
		headers: {
			"User-Agent": "ft_transcendence-authentication-server",
      		Accept: "application/vnd.github+json",
      		Authorization: `Bearer ${token.access_token}`,
      		"X-GitHub-Api-Version": "2022-11-28"}
  });

	const user = await res.json();
console.log(user);

//const res = await fetch("https://api.github.com/user/emails", {	

	res = await fetch("https://api.github.com/user/emails", {
		headers: {
			"User-Agent": "ft_transcendence-authentication-server",
      		Accept: "application/vnd.github+json",
      		Authorization: `Bearer ${token.access_token}`,
      		"X-GitHub-Api-Version": "2022-11-28"}
  });

  	const emails = await res.json();
console.log(emails);

	const primary_verified_emails =
		emails.filter((item) => { return item.primary && item.verified } )

console.log(primary_verified_emails);
	const email = (primary_verified_emails.length != 0) ? primary_verified_emails[0].email : null

	return { fullName: user.name, email: email };
}


fastify.get(`/login/github/callback`, async function (req, res) {

	try {
//throw (Error("test"));
		const { token } = await this.githubOAuth2.getAccessTokenFromAuthorizationCodeFlow(req);
		if (!token)
			throw (Error("no github token"));

//console.log(`token.access_token`)

		const user = await getGitHubUserDetails(token)

console.log(user);
		if (!user.email)
			throw (Error("cannot get email"));

		const response = await fetch(`${USER_SERVICE_URL}/api/user/getbyemail/${user.email}`,
		{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                api_passphrase: process.env.API_PASSPHRASE,
            })
        })

		const userData = await response.json();

console.log(userData);




		return { access_token: token.access_token };
	}
	catch(err) {
		console.log(err)
		return res.redirect("http://localhost:3000/error")
	}
});





fastify.post('/api/auth/login', async (req, res) => { 
console.log('# /auth/login');
console.log(req.body);

	const email = req.body.userlogin
	const password = req.body.password

	try {
		const response = await fetch(`${USER_SERVICE_URL}/api/user/getbyemail/${email}`);
console.log(response);

		const userData = await response.json();

console.log(userData);

		if (!userData)
			return res.status(401).send( {msg: "Invalid user or password"} );

		if (!await bcrypt.compare(password, userData.password))
			return res.status(401).send( {msg: "Invalid user or password"} );

		const token = jwt.sign( { userId: userData.id }, process.env.JWT_SECRET );

console.log(token)

		res.status(200).cookie("ft_transcendence_jwt", token, {
			path: "/",
			httpOnly: true,
			sameSite: "none",
			secure: true
		}).send();

	}
	catch (error) {
console.error(error);
		return res.status(500).send( {msg: "Internal error"} );
	}
})



fastify.post('/api/auth/signup', async (req, res) => { 
console.log('# /auth/signup');
console.log(req.body);

	const email = req.body.email
	const name = req.body.name
	const password = req.body.password

	try {
		const pwHash = await bcrypt.hash(password, 12);

		const response = await fetch(`${USER_SERVICE_URL}/api/user/newuser`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				email: email,
				name: name,
				password: pwHash
			})
		}

		);
//console.log(response);
		if (response.status == 500)
			return res.status(500).send( {msg: "Can't create user"} );

		if (response.status == 404)
			return res.status(404).send( {msg: "Invalid user name of password"} );

		const userData = await response.json();

console.log(userData);


		const token = jwt.sign( { userId: userData.id }, process.env.JWT_SECRET );

console.log(token)

		res.status(200).cookie("ft_transcendence_jwt", token, {
			path: "/",
			httpOnly: true,
			sameSite: "none",
			secure: true
		}).send();
	}
	catch (error) {
console.error(error);
		return res.status(500).send( {msg: "Internal error"} );
	}
})


fastify.post('/api/auth/changepw', async (req, res) => { 
console.log('# /api/auth/changepw');

	const pw = req.body.pw;
	const pwHash = req.body.pwhash;
	const newPw = req.body.newpw;

console.log(pw);
console.log(pwHash);
console.log(newPw);

	try {
		if (!await bcrypt.compare(pw, pwHash))
			return res.status(401).send();

		const newPwHash = await bcrypt.hash(newPw, 12);

console.log(newPwHash);

		return res.status(200).send( {newpwhash: newPwHash} );
	} catch (error) {
		return res.status(500).send();
	}
})


fastify.delete('/api/auth/logout', async (req, res) => { 
console.log('# /api/auth/logout');

	return res.status(200).clearCookie('ft_transcendence_jwt', {}).send();

})









// Run the serveur!
fastify.listen({ host: '0.0.0.0', port: process.env.PORT ?? 3000 }, (err) => {
	if (err) {
		console.error(err)
		process.exit(1)
	}
})


//module.exports = async function (app, options) {
