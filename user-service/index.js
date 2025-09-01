// npm i fastify
// npm i sqlite3
// npm i prisma --save-dev
// npm i @fastify/cookie
// npm i jsonwebtoken


//@fastify/static
// npm i @fastify/cookie
// npm i @fastify/jwt
// npm i sqlite3
// npm i prisma --save-dev
// npm i bcrypt
// npm i jsonwebtoken

//Create db from schema
//DATABASE_URL="file:./users_db.db"; npx prisma migrate dev --name init
//npx prisma migrate reset


/* 9 6

const fastify = require('fastify')({ logger: false })
const fastify_static = require('@fastify/static')
const path = require('path')
const jwt = require('jsonwebtoken');
//const { Interface } = require('readline')

const fastify_jwt = require('@fastify/jwt')
//const  { FastifyJWT } = require('@fastify/jwt')
const fastify_cookie = require('@fastify/cookie')

//import { PrismaClient } from '@prisma/client'
const  { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


*/

const { AUTH_SERVICE_URL } = process.env;
if (!AUTH_SERVICE_URL) {
	throw new Error("Missing AUTH_SERVICE_URL env var");
}

const fastify = require('fastify')({ logger: false })

//const { prisma } = require('./index.js')

const  { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const fastify_cookie = require('@fastify/cookie')
const jwt = require('jsonwebtoken');



// Temporary due to CORS sh!te
fastify.addHook('preHandler', (req, res, next) => {
console.log("preHandler-CORS-tmp");
//  req.jwt = fastify.jwt

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



/*
fastify.addHook('preHandler2', (req, res, next) => {
console.log("hahaha");
//  req.jwt = fastify.jwt

	try {
//		const token = req.cookies['ft_transcendence_jwt'];

//		const decoded = jwt.verify(token, 'supersecretcode-CHANGE_THIS-USE_ENV_FILE');

	} catch (error) {
		return res.status(401).send({ error: 'Invalid token' });
	}
  return next()
})
*/


// fastify.register(fastify_cookie, {
//   secret: process.env.JWT_SECRET,
//   hook: 'preHandler',
// })

fastify.register(fastify_cookie, {})

fastify.register(protected_routes)




fastify.get('/api/user_getbyemail/:email', {}, async function (req, res) {

console.log(req.params);

	const value = req.params.email;

	try {
		var user = await prisma.user.findUnique({
			where: { 
				email: value
			}
		})
		return res.send(user);
	}
	catch (error) {
		res.status(500).send("")
	}


})


fastify.get('/api/user_getbyid/:id', {}, async function (req, res) {

console.log(req.params);

	const value = req.params.id;

	try {
		var user = await prisma.user.findUnique({
			where: { 
				id: value
			}
		})
		return res.send(user);
	}
	catch (error) {
		res.status(500).send("")
	}


})


//0123456789012345678901234567890123456789
 
fastify.post('/api/user_newuser', {}, async function (req, res) {

console.log('# /newuser');
console.log(req.body);

//		const { username, useremail, password } = req.body;
	try {
		const email = req.body.email;
		const name = req.body.name;
		const password = req.body.password;

//		if (!validateEmail(email))
//			return res.status(404).send( {} );

		if (!validatePassword(password))
		 	return res.status(404).send( {} );

		if (!validateUserName(name))
			return res.status(404).send( {} );

		uniqueUserName = await checkUserNameDuplicate(name)
console.log("uniqueUserName");
console.log(uniqueUserName);
		if (uniqueUserName == "")
			return res.status(404).send( {} );

			let user = await prisma.user.create({
				data: { name: uniqueUserName, email, password }
			})
console.log(user);
console.log('newuser created');

		res.status(200).send(user);
	}
	catch (error) {
console.error('newuser pancarte');
		console.error(error);
		res.status(500).send( {} );
	}
})



// Run the serveur!
fastify.listen({ host: '0.0.0.0', port: process.env.PORT ?? 3000 }, (err) => {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
})


function validateEmail(email) {

	return String(email)
    	.toLowerCase()
    	.match(
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};


function validateUserName(userName) {

	if (userName.length == 0)
		return false
	if (userName.length > 32)
		return false
	return true	
};

function validatePassword(password) {

	if (password.length > 64)
		return false

	return true
};

async function checkUserNameDuplicate(userName) {
console.log("checkUserNameDuplicate")
console.log(userName)
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




function protected_routes(fastify_instance, options, next) {

// JWT verification function
const verifyJWT = async (req, res) => {
console.log("PreHandler verifyJWT");


	req.user = undefined
	try {
console.log(req.cookies);
		if (!req.cookies)
			return

		const token = req.cookies['ft_transcendence_jwt'];
console.log("upr verifyJWT 1");
//console.log("token: " + token + "\n");
console.log(token);
		if (!token)
			return;

		const decoded = jwt.decode(token);
console.log("upr verifyJWT 2");
console.log(decoded);
		req.user = {userId: decoded.userId}
	}
	catch(error) {
		console.error(error);
	}
};


	fastify_instance.get('/api/user/getloggeduser', { preHandler: [verifyJWT] }, async function (req, res) {

console.log("/api/user/getloggeduser");
console.log(req.user);

		try {
			var user = await prisma.user.findUnique({
				where: { 
					id: req.user.userId
				}
			})
			return res.status(200).send(
				{
				id: user.id,
				name: user.name, email: user.email,
				language: user.language, rank: user.rank, keymap: user.keymap
				}
			);
		}
		catch (error) {
			res.status(500)
		}
	})



	fastify_instance.put('/api/user/updatekeybinds/:keymap', { preHandler: [verifyJWT] }, async function (req, res) {

		const keymap = req.params.keymap;

console.log("/api/user/updatekeybinds");
console.log(keymap);

		try {
			var user = await prisma.user.update({
				where: { 
					id: req.user.userId
				},
    			data: {
                    keymap: keymap
                }
			})
			return res.status(200).send( {keymap: keymap} );
		}
		catch (error) {
			res.status(500)
		}
	})


	fastify_instance.put('/api/user/updateusername/:newusername', { preHandler: [verifyJWT] }, async function (req, res) {

		const newName = req.params.newusername;

console.log("/api/user/updateusername");
console.log(newName);

		try {
			var user = await prisma.user.findUnique({
				where: { 
					id: req.user.userId
				}
			})
			if (user.name == newName)
				res.status(200).send( {name: newName} )

			var altName = await checkUserNameDuplicate(newName)
			if (altName == "")
				res.status(200).send( {name: ""} )

			var user = await prisma.user.update({
				where: { 
					id: req.user.userId
				},
    			data: {
                    name: altName
                }
			})

			return res.status(200).send( {name: altName} );
		}
		catch (error) {
			res.status(500)
		}

	})



	fastify_instance.put('/api/user/updatepw/:pw/:newpw', { preHandler: [verifyJWT] }, async function (req, res) {

		const pw = req.params.pw;
		const newPw = req.params.newpw;

console.log("/api/user/updatepw");
console.log(pw);
console.log(newPw);

//var hashedPassword = "132"

		try {
			var user = await prisma.user.findUnique({
				where: { 
					id: req.user.userId
				}
			})
console.log(user);
			if (!user)
				return res.status(500).send()			

console.log("uu");
			const response = await fetch(`${AUTH_SERVICE_URL}/api/auth/changepw`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					pw: pw,
					pwhash: user.password,
					newpw: newPw
				})
			})

//console.log(response);
console.log("response received");
			if (response.status == 401)
				return res.status(401).send();
			if (response.status == 500)
				return res.status(500).send();

			const userData = await response.json();


console.log(userData);

			var user = await prisma.user.update({
				where: {  
					id: req.user.userId
				},
    			data: {
                    password: userData.newpwhash
                }
			})

			return res.status(200).send();
		}
		catch (error) {
			res.status(500).send()
		}
	})

	next()
}
