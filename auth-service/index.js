// npm i fastify @fastify/cookie @fastify/jwt @fastify/oauth2
// npm i bcrypt jsonwebtoken
// npm i @fastify/oauth2

// npm i fastify @fastify/cookie @fastify/jwt @fastify/oauth2 bcrypt jsonwebtoken @fastify/oauth2

const { USER_SERVICE_URL } = process.env;
if (!USER_SERVICE_URL) {
	throw new Error("Missing USER_SERVICE_URL env var");
}

const fastify = require('fastify')({ logger: false })
const fastify_cookie = require('@fastify/cookie')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fastifyOauth2 = require("@fastify/oauth2");

const { validateEmail, validateUserName, validatePassword } = require('./validators.js')


function API_Error(message) {
	const err = new Error(message)
	err.name =  "API_Error";
	return err			
}


// Cookies
fastify.register(fastify_cookie, {
  secret: process.env.JWT_SECRET,
  hook: 'preHandler',
})


// OAuth
const startRedirectPath = `/api/auth/login/github`
const callbackUri = `https://localhost:8443/api/auth/login/github/callback`
//const startRedirectPath = `/login/github`
//const callbackUri = `https://localhost:8443/login/github/callback`


fastify.register(fastifyOauth2, {
	name: 'githubOAuth2',
	scope: ["user:email", "read:user"],
	credentials: {
		client: {
			id: process.env.GITHUB_OAUTH_ID,
			secret: process.env.GITHUB_OAUTH_SECRET,
		},
		auth: fastifyOauth2.GITHUB_CONFIGURATION
	},
	startRedirectPath,
	callbackUri,
});


// Temporary due to CORS sh!te
fastify.addHook('preHandler', (req, res, next) => {
// console.log("hohohoho");

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
// console.log(user);

//const res = await fetch("https://api.github.com/user/emails", {	

	res = await fetch("https://api.github.com/user/emails", {
		headers: {
			"User-Agent": "ft_transcendence-authentication-server",
      		Accept: "application/vnd.github+json",
      		Authorization: `Bearer ${token.access_token}`,
      		"X-GitHub-Api-Version": "2022-11-28"}
	});

  	const emails = await res.json();
// console.log(emails);

	if (emails.length >= 2)
		if (emails[1].email == "testtest@notrealthisisa.test")
			return { fullName: "Dev-test", email: "a@a.aa" }

	const primary_verified_emails =
		emails.filter((item) => { return item.primary && item.verified } )

// console.log(primary_verified_emails);
	const email = (primary_verified_emails.length != 0)
		? primary_verified_emails[0].email
		: null

	return { fullName: user.name, email: email }
}


fastify.get(`/api/auth/login/github/callback`, async function (req, res) {

	try {
//throw (Error("test"));
		const { token } = await this.githubOAuth2.getAccessTokenFromAuthorizationCodeFlow(req);
		if (!token)
			throw API_Error("no_github_token")

		const gh_user = await getGitHubUserDetails(token)

// console.log(gh_user);
		if (!gh_user?.email)
			throw API_Error("cannot_get_email")

		if (!validateUserName(gh_user.fullName))
			throw API_Error("name_incompatible")

		const getbyemail_res = await fetch(`${USER_SERVICE_URL}/api/user/getbyemail`,
		{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
				email: gh_user.email,
                api_passphrase: process.env.API_PASSPHRASE,
            })
        })

		if (![200, 404].includes(getbyemail_res.status))
			throw API_Error(`user_service_error_${getbyemail_res.status}`)

		var userData = null
		if (getbyemail_res.status == 200) {
		// Sign in existing user
			userData = await getbyemail_res.json()

//console.log("UU");
// console.log(userData);
//console.log("UU");
		}
	
		if (getbyemail_res.status == 404) {
		// Sign up a new user
// console.log("Sign up a new user");
			const createuser_res = await fetch(`${USER_SERVICE_URL}/api/user/createuser`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: gh_user.email,
					name: gh_user.fullName,
					password: null,
					api_passphrase: process.env.API_PASSPHRASE
				})
			});
// console.log(createuser_res.status);
			if (createuser_res.status == 400) {
				const {msg} = await createuser_res.json()
				throw API_Error(msg)
			}
			if (createuser_res.status == 404)
				throw API_Error("db_error")

			userData = await createuser_res.json()
// console.log(userData);
		}

		const session_token = jwt.sign( { userId: userData.id },
			process.env.JWT_SECRET, { expiresIn: '24h' });
// console.log(session_token)
//		res.status(200).cookie("ft_transcendence_jwt", session_token, {
		res.cookie("ft_transcendence_jwt", session_token, {
			path: "/",
			httpOnly: true,
			sameSite: "none",
			secure: true
		}).redirect("https://localhost:8443")
//		}).redirect("http://localhost:3000/login?oauth=true")

//		return { access_token: token.access_token }
	}
	catch(err) {
//		console.error(`${err.name}: ${err.message}`);
		console.log(err)
		if (err.name == "API_Error")
			res.redirect(`http://localhost:3000/error?oauth-error=${err.message}`)
		else
			res.redirect(`http://localhost:3000/error?oauth-error`)
	}
});


fastify.post('/api/auth/login', async (req, res) => { 
// console.log('#POST /auth/login');
// console.log(req.body);

	const userlogin = req.body.userlogin.trim()
	const password = req.body.password.trim()

	try {
		var	getbylogin_res = null

		if (userlogin.includes('@')) {
// console.log("->email");
			getbylogin_res = await fetch(`${USER_SERVICE_URL}/api/user/getbyemail`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: userlogin,
					api_passphrase: process.env.API_PASSPHRASE,
				})
			})
		}
		else {
// console.log("->name");
			getbylogin_res = await fetch(`${USER_SERVICE_URL}/api/user/getbyname`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: userlogin, 
					api_passphrase: process.env.API_PASSPHRASE,
				})
			})
		}

		if (getbylogin_res.status == 404)
			return res.status(401).send()
		if (getbylogin_res.status != 200)
			throw API_Error(`user_service_error_${getbylogin_res.status}`)

		const userData = await getbylogin_res.json();
// console.log(userData);
// throw API_Error("test")
//throw Error("iii")
		if (!await bcrypt.compare(password, userData.password))
			return res.status(401).send();

		const token = jwt.sign( { userId: userData.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

// console.log(token)

		res.status(200).cookie("ft_transcendence_jwt", token, {
			path: "/",
			httpOnly: true,
			sameSite: "none",
			secure: true
		}).send();

	}
	catch (err) {
		console.log(err)
// Revoir cette daube quand il y aura ngix
		if (err.name == "API_Error")
			res.status(500).send( { msg: err.message } )
		else {
			console.log(err)
			res.status(500).send( { msg: null } )
		}	
//CORS sh!te ?#!à$
		//  if (err.name == "API_Error")
		//  	res.redirect(`http://localhost:3000/error?login-error=${err.message}`)
		//  else {
		//  	console.log(err)
		//  	res.redirect(`http://localhost:3000/error?login-error`)
		//}
	}
})


fastify.post('/api/auth/signup', async (req, res) => { 
// console.log('# /auth/signup');
// console.log(req.body);

	const name = req.body.name.trim()
	const email = req.body.email.trim()
	const password = req.body.password.trim()

	try {
		if (!validateUserName(name))
			throw API_Error("name_malformed")
		if (!validateEmail(email))
		 	throw API_Error("email_malformed")
//TODO A REMETTRE EN PROD
//		if (!validatePassword(password))
//			throw API_Error("password_malformed")
		
		const pwHash = await bcrypt.hash(password, 12);

		const createuser_res = await fetch(`${USER_SERVICE_URL}/api/user/createuser`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				email: email,
				name: name,
				password: pwHash,
				api_passphrase: process.env.API_PASSPHRASE
			})
		});
// console.log(createuser_res.status);
		if (createuser_res.status == 400 || createuser_res.status == 500) {
			const {msg} = await createuser_res.json()
			throw API_Error(msg)
		}

		userData = await createuser_res.json()
// console.log(userData);

		const token = jwt.sign( { userId: userData.id }, process.env.JWT_SECRET );
// console.log(token)

		res.status(200).cookie("ft_transcendence_jwt", token, {
			path: "/",
			httpOnly: true,
			sameSite: "none",
			secure: true
		}).send()
	}
	catch (err) {
		console.log(err)
		if (err.name == "API_Error")
			res.status(500).send( { msg: err.message } )
		else
			res.status(500).send( { msg: null } )
	}
})


fastify.post('/api/auth/changepw', async (req, res) => { 
// console.log('# /api/auth/changepw');

	const pw = req.body.pw;
	const pwHash = req.body.pwhash;
	const newPw = req.body.newpw;

// console.log(pw);
// console.log(pwHash);
// console.log(newPw);

	try {
		if (!await bcrypt.compare(pw, pwHash))
			return res.status(401).send();

		const newPwHash = await bcrypt.hash(newPw, 12);

// console.log(newPwHash);

		return res.status(200).send( {newpwhash: newPwHash} );
	} catch (error) {
		console.log(err)
		return res.status(500).send();
	}
})


fastify.delete('/api/auth/logout', async (req, res) => { 
// console.log('# /api/auth/logout');

	return res.status(200).clearCookie('ft_transcendence_jwt', {}).send();
})


// Run the serveur!
fastify.listen({ host: '0.0.0.0', port: process.env.PORT ?? 3000 }, (err) => {
	if (err) {
		console.error(err)
		process.exit(1)
	}
})
