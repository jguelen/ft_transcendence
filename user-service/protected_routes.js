// protected_routes.js

const { prisma } = require('./index.js')

const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env


exports.protected_routes = function(fastify_instance, options, next) {

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

		const decoded = jwt.verify(token, JWT_SECRET);

//		const decoded = jwt.decode(token); // no sign verif
console.log("upr verifyJWT 2");
console.log(decoded);
		req.user = {userId: Number(decoded.userId)}
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


	fastify_instance.put('/api/user/updatelanguage/:language', { preHandler: [verifyJWT] }, async function (req, res) {

		const language = req.params.language;

console.log("/api/user/updatelanguage");
console.log(language);

		try {
			var user = await prisma.user.update({
				where: { 
					id: req.user.userId
				},
    			data: {
                    language: language
                }
			})
			return res.status(200).send( {language: language} );
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


	fastify_instance.get('/api/user/getrelationship/:userid', { preHandler: [verifyJWT] },
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

