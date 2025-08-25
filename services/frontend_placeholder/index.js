// npm i fastify @fastify/static


const fastify = require('fastify')({ logger: false })
const fastify_static = require('@fastify/static')
const path = require('path')




fastify.register(fastify_static, {
	root: path.join(__dirname, 'public'),
	prefix: '/public/', 
//constraints: { host: 'example.com' } // optional: default {}
})


fastify.addHook('preHandler', (req, res, next) => {
console.log("hihihihihi");
//  req.jwt = fastify.jwt

res.header("Access-Control-Allow-Origin", "http://localhost:3002")
res.header("Access-Control-Allow-Credentials", true)


  const isPreflight = /options/i.test(req.method);
  if (isPreflight) {
	 res.header("Access-Control-Allow-Methods", "*")
 res.header("Access-Control-Allow-Headers",  'Content-Type, Authorization')

    return res.send();
  }

  return next()
})




/*
fastify.get('/', { }, function (req, res) {
	res.sendFile('index.html')
})


fastify.get('/chat', { }, function (req, res) {
 	res.sendFile('index.html')
})

fastify.get('/settings', { }, function (req, res) {
 	res.sendFile('index.html')
})

fastify.get('/Profile', { }, function (req, res) {
 	res.sendFile('index.html')
})

fastify.get('/account', { }, function (req, res) {
 	res.sendFile('index.html')
})


fastify.get('/login', { }, function (req, res) {
 	res.sendFile('index.html')
})

fastify.get('/signup', { }, function (req, res) {
 	res.sendFile('index.html')
})
*/

fastify.get('/', { }, sendAppPage)
fastify.get('/home', { }, sendAppPage)
fastify.get('/chat', { }, sendAppPage)
fastify.get('/settings', { }, sendAppPage)
fastify.get('/Profile', { }, sendAppPage)
fastify.get('/account', { }, sendAppPage)
fastify.get('/login', { }, sendAppPage)
fastify.get('/signup', { }, sendAppPage)

function sendAppPage(req, res) {
	res.sendFile('index.html')
}


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


// Run the serveur!
fastify.listen({ port: 3000 }, (err) => {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
})
