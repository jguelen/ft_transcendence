// privates_routes.js

const { prisma } = require('./index.js')
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');


exports.private_routes = function(fastify_instance, options, next) {

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


//------------------------------------------------------------------------------	
	fastify_instance.post('/newuser', async (req, res) => { 
console.log('# /newuser');
console.log(req.body);

//		const { username, useremail, password } = req.body;

		try {
			const email = req.body.useremail;
			const name = req.body.username;
			const password = req.body.password;

console.log('newuser 1');			
			const pwHash = await bcrypt.hash(password, 12);
console.log('newuser 2');

			let user = await prisma.user.create({
				data: {
					name,
					email,
					password
				}
			})
console.log(user);
console.log('newuser created');

			const token = jwt.sign({userId: user.id}, 'supersecretcode-CHANGE_THIS-USE_ENV_FILE' );

			res.status(200).cookie("ft_transcendence_jwt", token, {
				path: "/",
				httpOnly: true,
				sameSite: "none",
				secure: true
			}).send("");

		}
		catch (error) {
console.error('newuser pancarte');
console.error(error);
			res.status(500).send("Error");
		}
	})

	next()
}
