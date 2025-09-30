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

const { AUTH_SERVICE_URL } = process.env;
if (!AUTH_SERVICE_URL) {
	throw new Error("Missing AUTH_SERVICE_URL env var");
}

const fastify = require('fastify')({ logger: false })



const  { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const fastify_cookie = require('@fastify/cookie')



fastify.addHook('preHandler', (req, res, next) => {
// console.log("preHandler-CORS-tmp");
//  req.jwt = fastify.jwt

	res.header("Access-Control-Allow-Origin", "http://localhost:3002")
	res.header("Access-Control-Allow-Credentials", true)

	const isPreflight = /options/i.test(req.method);
	if (isPreflight) {
		res.header("Access-Control-Allow-Methods", "GET, PUT, DELETE, POST, OPTIONS");
		res.header("Access-Control-Allow-Headers", 'Content-Type, Authorization');
		return res.send();
  }


  return next()
})



// fastify.register(fastify_cookie, {
//   secret: process.env.JWT_SECRET,
//   hook: 'preHandler',
// })

fastify.register(fastify_cookie, {})


exports.prisma = prisma

exports.checkUserNameDuplicate = checkUserNameDuplicate

const {protected_routes} = require('./protected_routes.js')
const {api_private_routes} = require('./api_private_routes.js')

fastify.register(protected_routes)
fastify.register(api_private_routes)



// Run the serveur!
fastify.listen({ host: '0.0.0.0', port: process.env.PORT ?? 3002 }, (err) => {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
})

async function checkUserNameDuplicate(userName) {
// console.log("checkUserNameDuplicate")
// console.log(userName)
// console.log("prisma :", prisma != mull);
//	try {
		var user = await prisma.user.findMany({
			where: { 
				name: userName
			}
		})
// console.log("checkUserNameDuplicate: 1")		
// console.log(user)
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
// console.log(`checkUserNameDuplicate: 2 - ${index}`)
// console.log(user)
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
