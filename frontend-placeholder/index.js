// npm i fastify @fastify/static @fastify/cookie
// npm i jsonwebtoken


const fastify = require('fastify')({ logger: false })
const fastify_static = require('@fastify/static')
const path = require('path')
const fastify_cookie = require('@fastify/cookie')
const jwt = require('jsonwebtoken');


fastify.register(fastify_static, {
	root: path.join(__dirname, 'public'),
	prefix: '/public/', 
//constraints: { host: 'example.com' } // optional: default {}
})


// cookies
fastify.register(fastify_cookie, {
  secret: 'jwtsecret',
  hook: 'preHandler',
})


fastify.addHook('preHandler', (req, res, next) => {
	res.header("Access-Control-Allow-Origin", "http://localhost:3000")
	res.header("Access-Control-Allow-Credentials", true)

	const isPreflight = /options/i.test(req.method);
	if (isPreflight) {
		res.header("Access-Control-Allow-Methods", "GET, PUT, DELETE, POST, OPTIONS")
		res.header("Access-Control-Allow-Headers",  'Content-Type, Authorization')
		return res.send();
	}
	return next()
})



// JWT verification function
const verifyJWT = async (req, res) => {
//console.log("verifyJWT0");

	req.user = undefined
	try {
console.log(req.cookies);
		if (!req.cookies)
			return

		const token = req.cookies['ft_transcendence_jwt'];
console.log("verifyJWT 1");
//console.log("token: " + token + "\n");
console.log(token);
		if (!token)
			return;

		const decoded = jwt.decode(token);
console.log("verifyJWT 2");
console.log(decoded);
		req.user = {userId: decoded.userId}
	}
	catch(error) {
		console.error(error);
	}
};



fastify.get('/login/github', {}, (req, res) => {

res.sendFile('index.html')
})


fastify.get('/error', {}, sendAppPage_unconnected)

fastify.get('/login', { preHandler: [verifyJWT] }, sendAppPage_unconnected)
fastify.get('/signup', { preHandler: [verifyJWT] }, sendAppPage_unconnected)

fastify.get('/', { preHandler: [verifyJWT] }, sendAppPage_protected)
fastify.get('/home', { preHandler: [verifyJWT] }, sendAppPage_protected)
fastify.get('/chat', { preHandler: [verifyJWT] }, sendAppPage_protected)
fastify.get('/settings', { preHandler: [verifyJWT] }, sendAppPage_protected)
fastify.get('/Profile', { preHandler: [verifyJWT] }, sendAppPage_protected)
fastify.get('/account', { preHandler: [verifyJWT] }, sendAppPage_protected)

fastify.get('/game_local', { preHandler: [verifyJWT] }, sendAppPage_protected)
fastify.get('/game_online', { preHandler: [verifyJWT] }, sendAppPage_protected)
fastify.get('/game_tournament', { preHandler: [verifyJWT] }, sendAppPage_protected)

fastify.get('/profile_profile', { preHandler: [verifyJWT] }, sendAppPage_protected)
fastify.get('/profile_settings', { preHandler: [verifyJWT] }, sendAppPage_protected)
fastify.get('/profile_account', { preHandler: [verifyJWT] }, sendAppPage_protected)

fastify.get('/userprofile/:name', { preHandler: [verifyJWT] }, sendAppPage_protected)





// Run the serveur!
fastify.listen({ port: 3000 }, (err) => {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
})

function getUser(user) {
//console.log(user);
	if (user == undefined)
		return undefined;

	return {id: user.userId};
}



function sendAppPage_unconnected(req, res) {

	const user = getUser(req.user);
	if(user == undefined)
		return res.sendFile('index.html')

	res.redirect('/')
}

function sendAppPage_protected(req, res) {

	const user = getUser(req.user);
	if(user == undefined)
		return res.redirect('/login')

	res.sendFile('index.html')
}
