// api_private_routes.js

const { prisma } = require('./index.js')

const { validateEmail, validateUserName, validatePassword } = require('./validators.js')




exports.api_private_routes = function(fastify_instance, options, next) {

	fastify_instance.addHook('preValidation', (req, res, done) =>  {
console.log(req.body);	

		if (req.body?.api_passphrase != process.env.API_PASSPHRASE) {
console.log("api_private_routes");	
			return res.status(403).send(); // Forbidden
		}
		done()
	})


	fastify_instance.post('/api/user/getbyemail', {}, async function (req, res) {
console.log("#POST /api/user/getbyemail/:email");
console.log(req.body);
		try {
			var user = await prisma.user.findUnique({
				where: { 
					email: req.body.email
				}
			})
console.log(user)
			if (user == null)
				return res.status(404).send()
			return res.status(200).send(user)
		}
		catch (err) {
			console.log(err)
			res.status(500).send()
		}
	})

	
	fastify_instance.post('/api/user/getbyname', {}, async function (req, res) {
console.log("#POST /api/user/getbyname");
console.log(req.body.name);
		try {
			var user = await prisma.user.findMany({
				where: { 
					name: req.body.name
				}
			})
console.log(user)
			if (user.length == 0)
				return res.status(404).send()
			return res.status(200).send(user[0])
		}
		catch (err) {
			console.log(err)
			res.status(500).send()
		}
	})


	fastify_instance.post('/api/user/createuser', {}, async function (req, res) {
console.log('# /newuser');
//console.log(req.body);

	//		const { email, name, password } = req.body;
		try {
			const email = req.body.email;
			const name = req.body.name;
			const password = req.body.password;

			if (!validateEmail(email))
				return res.status(400).send( {msg: "email_malformed"} )
//			if (!validatePassword(password))
//			  	return res.status(400).send( {msg: "password_malformed"} );
			if (!validateUserName(name))
			 	return res.status(400).send( {msg: "username_malformed"} );

			uniqueUserName = await checkUserNameDuplicate(name)
console.log("uniqueUserName");
console.log(uniqueUserName);
			if (uniqueUserName == "")
				return res.status(400).send( {msg: "cannot_create_user"} );

			const user = await prisma.user.create({
				data: { name: uniqueUserName, email, password }
			})
console.log(user);


console.log('newuser created');

			res.status(200).send(user);
		}
		catch (err) {
console.error('newuser pancarte');
			console.log(err);
			if (err.code = 'P2002')
				return res.status(500).send( {msg: "email_exists"} );
			res.status(500).send( {msg: "internal_error"} );
		}
	})

	next()
}


async function checkUserNameDuplicate(userName) {
console.log("checkUserNameDuplicate")
console.log(userName)
// console.log("prisma :", prisma != mull);
//	try {
		var user = await prisma.user.findMany({
			where: { 
				name: userName
			}
		})
console.log("checkUserNameDuplicate: 1")		
console.log(user)
		if (user.length == 0)
			return userName

		const altSuffixes = ["-1", "-2", "-3"]

		for (let index = 0; index < altSuffixes.length; index++) {			
			var alternateName = userName + altSuffixes[index];
			var user = await prisma.user.findMany({
				where: { 
					name: alternateName
				}
			})
console.log(`checkUserNameDuplicate: 2 - ${index}`)
console.log(user)
			if (user.length == 0)
				return alternateName
		}
		return ""
//	}
// 	catch (error) {
// console.log("Dupl catch")
// 		throw new Error(error);
// 	}
};
