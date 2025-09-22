// index.js

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

// npm i fastify @fastify/cookie @fastify/jwt sqlite3 bcrypt jsonwebtoken prisma --save-dev


/*

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



const  { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const fastify_cookie = require('@fastify/cookie')




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


exports.prisma = prisma

const {protected_routes} = require('./protected_routes.js')
const {api_private_routes} = require('./api_private_routes.js')

fastify.register(protected_routes)
fastify.register(api_private_routes)


/*
fastify.get('/api/user/getbyemail/:email', {}, async function (req, res) {
console.log("/api/user/getbyemail/:email");	
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
		res.status(500).send()
	}
})
*/


fastify.get('/api/user/getbyname/:name', {}, async function (req, res) {
console.log("/api/user/getbyname/:name");	
console.log(req.params);

	const value = req.params.name;
	try {
		var user = await prisma.user.findMany({
			where: { 
				name: value
			}
		})

console.log("result");
		if (user.length == 0)
			return res.status(200).send({});

console.log(user[0]);

		const userData = {id:user[0].id, name:value, rank:user[0].rank}

		return res.status(200).send(userData);
	}
	catch (error) {
console.error(error);
		res.status(500).send()
	}
})




//!!
fastify.get('/api/user/getbyid/:id', {}, async function (req, res) {
console.log("/api/user/getbyid/:id");	
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


fastify.post('/api/user/newuser', {}, async function (req, res) {
console.log('# /newuser');
console.log(req.body);

//		const { username, useremail, password } = req.body;
	try {
		const email = req.body.email;
		const name = req.body.name;
		const password = req.body.password;

//		if (!validateEmail(email))
//			return res.status(404).send( {} );

		// if (!validatePassword(password))
		//  	return res.status(404).send();

		// if (!validateUserName(name))
		// 	return res.status(404).send();

		uniqueUserName = await checkUserNameDuplicate(name)
console.log("uniqueUserName");
console.log(uniqueUserName);
		if (uniqueUserName == "")
			return res.status(404).send();

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
		res.status(500).send();
	}
})


// Run the serveur!
fastify.listen({ host: '0.0.0.0', port: process.env.PORT ?? 3000 }, (err) => {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
})


//avirer
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



