// npm i fastify @fastify/static


const fastify = require('fastify')({ logger: false })
const fastify_static = require('@fastify/static')
const path = require('path')




fastify.register(fastify_static, {
	root: path.join(__dirname, 'public'),
	prefix: '/public/', 
//constraints: { host: 'example.com' } // optional: default {}
})


fastify.get('/', { }, function (req, res) {

	res.sendFile('index.html')
})


/*
fastify.get('/', { preHandler: [verifyJWT] }, function (req, res) {

console.log(`req.user: ${req.user}`);

	const user = getUser(req.user);
	if(user == undefined)
		return res.redirect('/login')

console.log(`user: ${user}`);

	res.sendFile('index.html')
})
*/


// Run the server!
fastify.listen({ port: 3000 }, (err) => {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
})
