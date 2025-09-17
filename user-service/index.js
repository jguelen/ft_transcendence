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

		if (!validatePassword(password))
		 	return res.status(404).send();

		if (!validateUserName(name))
			return res.status(404).send();

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
			res.status(500).send()
		}

	})


	fastify_instance.put('/api/user/requestfriendship/:userid', { preHandler: [verifyJWT] }, async function (req, res) {
console.log("/api/user/requestfriendship/:userid");

		const requesteduserid = req.params.userid
console.log(requesteduserid);
//res.status(200).send({uu:ii});
//return 

		try {
			let friendshiprequest = await prisma.friendshipRequest.create({

			data: { requesterId: req.user.userId,
					requestedId: Number(requesteduserid)
			}
		})
console.log(friendshiprequest);
console.log('new friendshiprequest created');

			res.status(200).send();
		}
		catch (error) {
			console.error(error);
			res.status(500).send()
		}
	})


	fastify_instance.get('/api/user/getyourfriendshiprequests', { preHandler: [verifyJWT] }, async function (req, res) {

console.log("/api/user/getyourfriendshiprequests");
console.log(req.user);

		try {
			var yourfriendshiprequests = await prisma.$queryRawUnsafe(`
			SELECT friendshipRequest.*, user.name
			FROM friendshipRequest
			JOIN user ON friendshipRequest.requestedId = user.id
			WHERE requesterId = $1`,
			Number(req.user.userId)
			)

console.log(yourfriendshiprequests);

			return res.status(200).send(yourfriendshiprequests);
		}
		catch (error) {
			console.error(error);
			res.status(500)
		}
	})



	fastify_instance.delete('/api/user/delyourfriendshiprequest/:requestedid', { preHandler: [verifyJWT] }, async function (req, res) {

console.log("/api/user/delyourfriendshiprequest");
console.log(req.user);

		const requestedId = Number(req.params.requestedid)
console.log(req.params);

		try {
            await prisma.friendshipRequest.delete({
                where: {
				requesterId_requestedId: {
					requesterId: req.user.userId,
					requestedId: requestedId
				}         
				}
			})

			return res.status(200).send();
		}
		catch (error) {
			console.error(error);
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



	fastify_instance.get('/api/user/getfriendshiprequests', { preHandler: [verifyJWT] }, async function (req, res) {

console.log("/api/user/getfriendshiprequests");
console.log(req.user);

		try {
			var yourfriendshiprequests = await prisma.$queryRawUnsafe(`
			SELECT friendshipRequest.*, user.name
			FROM friendshipRequest
			JOIN user ON friendshipRequest.requesterId = user.id
			WHERE requestedId = $1`,
			Number(req.user.userId)
			)

console.log(yourfriendshiprequests);

			return res.status(200).send(yourfriendshiprequests);
		}
		catch (error) {
			console.error(error);
			res.status(500)
		}
	})


	fastify_instance.put('/api/user/acceptfriendshiprequest/:requesterid', { preHandler: [verifyJWT] }, async function (req, res) {

console.log("/api/user/acceptfriendshiprequest");
console.log(req.user);

		try {


		const requesterId = Number(req.params.requesterid)
console.log(requesterId)

		await prisma.$transaction([
			prisma.friendship.create({
				data: { user1Id: req.user.userId,
					user2Id: Number(requesterId)
				}
			}),

			prisma.friendshipRequest.delete({
				where: {
				requesterId_requestedId: {
					requesterId: requesterId,
					requestedId: req.user.userId
					}         
				}
			})
		])

console.log("ok");

			return res.status(200).send();
		}
		catch (error) {
			console.error(error);
			res.status(500)
		}
	})


	fastify_instance.put('/api/user/declinefriendshiprequest/:requesterid', { preHandler: [verifyJWT] }, async function (req, res) {

console.log("/api/user/declinefriendshiprequest");
console.log(req.user);

		const requesterId = Number(req.params.requesterid)

		try {
			await prisma.friendshipRequest.update({
			where: {
				requesterId_requestedId: {
					requesterId: requesterId,
					requestedId: req.user.userId
				}        
			},
			data: {
				declined: 1
			},
			})
console.log("ok");
			return res.status(200).send();
		}
		catch (error) {
			console.error(error);
			res.status(500)
		}
	})


	fastify_instance.get('/api/user/getfriends', { preHandler: [verifyJWT] }, async function (req, res) {

console.log("/api/user/getfriends");
console.log(req.user);

		try {

			var friends = await prisma.$queryRawUnsafe(`
			SELECT friendship.user2Id AS id, user.name, friendship.createdAt
			FROM friendship
			JOIN user ON friendship.user2Id = user.id
				WHERE user1Id = $1
			UNION
			SELECT friendship.user1Id AS id, user.name, friendship.createdAt
			FROM friendship
			JOIN user ON friendship.user1Id = user.id
				WHERE user2Id = $1`,
			Number(req.user.userId)
			)

console.log(friends);

			return res.status(200).send(friends);
		}
		catch (error) {
			console.error(error);
			res.status(500)
		}
	})

	fastify_instance.delete('/api/user/unfriend/:friendid', { preHandler: [verifyJWT] }, async function (req, res) {

console.log("/api/user/unfriend");
console.log(req.user);

		const friendId = Number(req.params.friendid)

console.log(req.params);

		try {
			var friendship = await prisma.$queryRawUnsafe(`
			SELECT friendship.user1Id, friendship.user2Id
			FROM friendship
				WHERE user1Id = $1 AND user2Id = $2
					OR user1Id = $2 AND user2Id = $1`,
			req.user.userId,
			friendId
			)

console.log(friendship);
			if (friendship.length == 0)
				return res.status(200).send()

            await prisma.friendship.delete({
                where: {
				user1Id_user2Id: {
					user1Id: friendship[0].user1Id,
					user2Id: friendship[0].user2Id
				}         
				}
			})

			return res.status(200).send();
		}
		catch (error) {
			console.error(error);
			res.status(500)
		}

	})


	fastify.get('/api/user/getrelationship/:userid', { preHandler: [verifyJWT] },
		async function (req, res) {
console.log("/api/user/getrelationship/:name");	
console.log(req.params);

		const targetUserId = req.params.userid;

		try {
			var relationship = await prisma.$queryRawUnsafe(`
SELECT CASE WHEN EXISTS ( SELECT * FROM friendship
WHERE (user1Id = $1 AND user2Id = $2
	OR user1Id = $2 AND user2Id = $1)
)
THEN TRUE ELSE FALSE END AS isfriend,

CASE WHEN EXISTS ( SELECT * FROM blockeduser
WHERE blockerId = $1 AND blockedId = $2
)
THEN TRUE ELSE FALSE END AS isblockedbyyou,

CASE WHEN EXISTS ( SELECT * FROM blockeduser
WHERE blockerId = $2 AND blockedId = $1
)
THEN TRUE ELSE FALSE END AS hasblockedyou`,
			req.user.userId,
			targetUserId)

var relationship = {
	isfriend: relationship[0].isfriend == 1,
	isblockedbyyou: relationship[0].isblockedbyyou  == 1,
	hasblockedyou: relationship[0].hasblockedyou  == 1
}
			
console.log(relationship);

			return res.status(200).send(relationship);
		}
		catch (error) {
			console.error(error);
			res.status(500).send()
		}
	})


	fastify_instance.get('/api/user/getblockeds', { preHandler: [verifyJWT] }, async function (req, res) {

console.log("/api/user/getblockeds");
console.log(req.user);

		try {
			var blockeds = await prisma.$queryRawUnsafe(`
			SELECT blockedUser.blockedId AS id, user.name
			FROM blockedUser
			JOIN user ON blockedUser.blockedId = user.id
				WHERE blockerId = $1`,
			Number(req.user.userId)
			)
console.log("blockeds");
console.log(blockeds);

			return res.status(200).send(blockeds);
		}
		catch (error) {
			console.error(error);
			res.status(500)
		}
	})


	fastify_instance.put('/api/user/block/:usertoblockid', { preHandler: [verifyJWT] }, async function (req, res) {

console.log("/api/user/block");
console.log(req.user);

		const usertoblockId = Number(req.params.usertoblockid)

		try {
			await prisma.blockedUser.create({

			data: { blockerId: req.user.userId,
					blockedId: usertoblockId
			}
			})

		console.log("ok");
			return res.status(200).send();
		}
		catch (error) {
			console.error(error);
			res.status(500)
		}
	})


	fastify_instance.delete('/api/user/unblock/:blockedid', { preHandler: [verifyJWT] }, async function (req, res) {

console.log("/api/user/unblock");
console.log(req.user);

		const blockedId = Number(req.params.blockedid)

console.log(req.params);

		try {
            await prisma.blockedUser.delete({
                where: {
				blockerId_blockedId: {
					blockerId: req.user.userId,
					blockedId: blockedId
				}         
				}
			})

			return res.status(200).send();
		}
		catch (error) {
			console.error(error);
			res.status(500)
		}
	})


	next()
}
