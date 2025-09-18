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





// cookies
fastify.register(fastify_cookie, {
  secret: process.env.JWT_SECRET,
  hook: 'preHandler',
})





  const startRedirectPath = `/login/github`;
  // TODO understand why it is using a full URL
  const callbackUri = `http://localhost:3001/login/github/callback`;

fastify.register(fastifyOauth2, {
  name: 'githubOAuth2',
  scope: ["user:email", "read:user"],
	credentials: {
	  client: {
		id: "id",
		secret: "secret",
	  },
	  auth: fastifyOauth2.GITHUB_CONFIGURATION,    
	},
	startRedirectPath,
	callbackUri,
});


async function getGitHubUserDetails(token) {
//  const res = await fetch("https://api.github.com/user/emails", {	
  const res = await fetch("https://api.github.com/user", {
    headers: {
      "User-Agent": "ft_transcendence-authentication-server",
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token.access_token}`,
      "X-GitHub-Api-Version": "2022-11-28"
    },
  });


  const user = await res.json();
 console.log(user);


 return {
     fullName: user.name,
     email: user.email,
   };


}


fastify.get(`/login/github/callback`, async function (request, reply) {

	const { token } = await this.githubOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

	console.log(`token.access_token`);

//    const user = await this.githubOAuth2.userinfo(token.access_token); 
//    if (!userinfo)
 //       throw (Error("cannot_get_user_infos"));


    const user = await getGitHubUserDetails(token)

    console.log(user);


	return { access_token: token.access_token };
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

	const email = req.body.useremail
	const name = req.body.username
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
