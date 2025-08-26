// npm i fastify @fastify/cookie @fastify/jwt
// npm i bcrypt jsonwebtoken


const fastify = require('fastify')({ logger: false })
const fastify_cookie = require('@fastify/cookie')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');




// cookies
fastify.register(fastify_cookie, {
  secret: 'supersecretcode-CHANGE_THIS-USE_ENV_FILE',
  hook: 'preHandler',
})




fastify.addHook('preHandler', (req, res, next) => {
console.log("hohohoho");
//  req.jwt = fastify.jwt

//res.header("Access-Control-Allow-Origin", "http://localhost:3000, http://localhost:3002")
	res.header("Access-Control-Allow-Origin", "http://localhost:3000")
	res.header("Access-Control-Allow-Credentials", true)

	const isPreflight = /options/i.test(req.method);
	if (isPreflight) {
		res.header("Access-Control-Allow-Methods", "*");
		res.header("Access-Control-Allow-Headers", 'Content-Type, Authorization');
		return res.send();
	}
	return next()
})




fastify.post('/api/auth_login', async (req, res) => { 
console.log('# /auth_login');
console.log(req.body);

	const email = req.body.useremail
	const password = req.body.password

	try {
		const response = await fetch(`http://localhost:3002/api/user_getbyemail/${email}`);
console.log(response);

		const userData = await response.json();

console.log(userData);

		if (!userData)
			return res.status(401).send( {msg: "Invalid user or password"} );

		if (!await bcrypt.compare(password, userData.password))
			return res.status(401).send( {msg: "Invalid user or password"} );

//		if (userByEmail.password != password)
//			return res.status(401).send("invalid user or password(pw)");

//                              VVV
		const token = jwt.sign( {userId: userData.id},
			'supersecretcode-CHANGE_THIS-USE_ENV_FILE' );

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




fastify.post('/api/auth_signup', async (req, res) => { 
console.log('# /auth_signup');
console.log(req.body);

	const email = req.body.useremail
	const name = req.body.username
	const password = req.body.password

	const pwHash = await bcrypt.hash(password, 12);

	try {

		const response = await fetch(`http://localhost:3002/api/user_newuser`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                name: name,
                password: pwHash
            }),
        }

		);
//console.log(response);
		if (response.status == 500)
			return res.status(500).send( {msg: "Can't create user"} );

		const userData = await response.json();

console.log(userData);


		res.status(200).send();
	}
	catch (error) {
console.error(error);
		return res.status(500).send( {msg: "Internal error"} );
	}


})






// Run the serveur!
fastify.listen({ port: 3001 }, (err) => {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
})

