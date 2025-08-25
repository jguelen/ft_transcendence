// npm i fastify @fastify/cookie @fastify/jwt

const fastify = require('fastify')({ logger: false })


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


fastify.post('/auth_login', async (req, res) => { 
console.log('# /auth_login');
console.log(req.body);

	const email = req.body.useremail

	try {
		const response = await fetch(`http://localhost:3002/api/user_getbyemail/${email}`);
console.log(response);

		const userData = await response.json();

console.log(userData);





		res.status(200).send();
	}
	catch (error) {
console.error(error);
		return res.status(500).send();
	}



})



/*
	fastify_instance.post('/user', async (req, res) => { 
console.log('# /user');
console.log(req.body);

		const { useremail, password } = req.body;
		// if (username != "uu" ) 
		// 	return res.status(401).send("Invalid user or password");
		// if (password != "1234" ) 
		// 	return res.status(401).send("Invalid user or password");

		try {
console.log(useremail);
			var userByEmail = await prisma.user.findUnique({
				where: {
					email: useremail,
				},
			});
		}
		catch(error) {
			return res.status(500).send(error);
//			return res.status(401).send("Invalid user or password");
		}
console.log('userByEmail:');
console.log(userByEmail);

		if (!userByEmail)
			return res.status(401).send("invalid user or password");

		if (!await bcrypt.compare(password, user.password))
			return res.status(401).send("invalid user or password");


//		if (userByEmail.password != password)
//			return res.status(401).send("invalid user or password(pw)");

//                              VVV
		const token = jwt.sign({userId: userByEmail.id},
			'supersecretcode-CHANGE_THIS-USE_ENV_FILE' );

		return (res.status(200).cookie("ft_transcendence_jwt", token, {
			path: "/",
			httpOnly: true,
			sameSite: "none",
			secure: true
		}).send(""));
	//                  }).send({ response: "successfully logged in", need2fa: true }));
	})
*/






// Run the serveur!
fastify.listen({ port: 3001 }, (err) => {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
})
