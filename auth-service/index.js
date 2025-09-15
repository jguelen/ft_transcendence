// npm i fastify @fastify/cookie @fastify/jwt
// npm i bcrypt jsonwebtoken

const { USER_SERVICE_URL } = process.env;
if (!USER_SERVICE_URL) {
	throw new Error("Missing USER_SERVICE_URL env var");
}

const fastify = require('fastify')({ logger: false })
const fastify_cookie = require('@fastify/cookie')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// cookies
fastify.register(fastify_cookie, {
  secret: process.env.JWT_SECRET,
  hook: 'preHandler',
})


// Temporary due to CORS sh!te
fastify.addHook('preHandler', (req, res, next) => {
console.log("hohohoho");
//  req.jwt = fastify.jwt

//res.header("Access-Control-Allow-Origin", "http://localhost:3000, http://localhost:3002")
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


/*
//fastify.get('/api/auth/changepw', async (req, res) => { 
//fastify.get('/api/auth/changepw/:pw/:pwhash/:newpw', async (req, res) => { 
fastify.get('/api/auth/changepw/:pw/:pwhash', async (req, res) => { 
console.log('# /api/auth/changepw');

	const pw = req.params.pw
	const pwHash = req.params.pwhash
	// const newPw = req.params.newpw

console.log(pw);
console.log(pwHash);


	res.status(200).send( {uuu: iii} );

})
*/

fastify.post('/api/auth/changepw', async (req, res) => { 
console.log('# /api/auth/changepw');

//	const pw = req.params.pw
//	const pwHash = req.params.pwhash
// const newPw = req.params.newpw

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
		fastify.log.error(err)
		process.exit(1)
	}
})
