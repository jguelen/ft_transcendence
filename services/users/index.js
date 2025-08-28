// npm i fastify
// npm i sqlite3
// npm i prisma --save-dev


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

const  { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()




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


fastify.post('/api/user_newuser', {}, async function (req, res) {

console.log('# /newuser');
console.log(req.body);

//		const { username, useremail, password } = req.body;
	try {
		const email = req.body.email;
		const name = req.body.name;
		const password = req.body.password;

		uniqueUserName = await checkUserNameDuplicate(name)
		console.log("uniqueUserName");
		console.log(uniqueUserName);

		if (uniqueUserName == "")
			res.status(404).send( {} );


//		if (!validateEmail(email))
//			return (res.status(404).send({ error: 1}))
/*
console.log('newuser 1');			
			const pwHash = await bcrypt.hash(password, 12);
console.log('newuser 2');
*/

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
fastify.listen({ port: 3002 }, (err) => {
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

};

function validatePassword(password) {

};

async function checkUserNameDuplicate(userName) {
console.log("checkUserNameDuplicate")

//	try {
		var user = await prisma.user.findMany({
			where: { 
				name: userName
			}
		})
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
