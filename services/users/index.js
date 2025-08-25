// npm i fastify
 

//@fastify/static
// npm i @fastify/cookie
// npm i @fastify/jwt
// npm i sqlite3
// npm i prisma --save-dev
// npm i bcrypt
// npm i jsonwebtoken

//Create db from schema
//npx prisma migrate dev --name init
//npx prisma migrate reset


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




const fastify = require('fastify')({ logger: false })

//const { prisma } = require('./index.js')


const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const  { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const fastify_cookie = require('@fastify/cookie')




fastify.addHook('preHandler', (req, res, next) => {
console.log("hohohoho");
//  req.jwt = fastify.jwt

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

/*
 res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "POST");
	res.header("Access-Control-Allow-Headers",  "*");
*/




//fastify.register(private_routes)
//fastify.register(public_routes)



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


// cookies
fastify.register(fastify_cookie, {
  secret: 'supersecretcode-CHANGE_THIS-USE_ENV_FILE',
  hook: 'preHandler',
})






fastify.post('/api/newuser', {}, async function (req, res) {

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
				data: { name, email, password }
			})
console.log(user);
console.log('newuser created');

			const token = jwt.sign({userId: user.id}, 'supersecretcode-CHANGE_THIS-USE_ENV_FILE' );
console.log('token:');
console.log(token);

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




// Run the serveur!
fastify.listen({ port: 3002 }, (err) => {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
})
