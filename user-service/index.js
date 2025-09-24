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


console.log(__dirname)
console.log("HUHUHUHAHA")

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



fastify.register(fastify_cookie, {})


exports.prisma = prisma

const {protected_routes} = require('./protected_routes.js')
const {api_private_routes} = require('./api_private_routes.js')

fastify.register(protected_routes)
fastify.register(api_private_routes)


// Run the serveur!
fastify.listen({ host: '0.0.0.0', port: process.env.PORT ?? 3000 }, (err) => {
	if (err) {
		console.log(err)
		process.exit(1)
	}
})
