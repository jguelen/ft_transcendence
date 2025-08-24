
// npm i fastify @fastify/static
// npm i @fastify/cookie
// npm i @fastify/jwt
// npm i sqlite3
// npm i prisma --save-dev
// npm i bcrypt


//sudo add-apt-repository -y ppa:linuxgndu/sqlitebrowser
//sudo apt-get update
//sudo apt-get install sqlitebrowser

//Create db from schema
//npx prisma migrate dev --name init
//npx prisma migrate reset


//npx prisma migrate dev --create-only ???

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




exports.prisma = prisma


const { private_routes } = require('./privates_routes.js')






/*
async function main() {
  // ... We will write our Prisma Client queries here


  const user = await prisma.user.create({
    data: {
      email: "arindammajumder2020@gmail.com",
      name: "Arindam Majumder",
      password: "12345678",
    },
  });

  console.log(user);

}


main()
.catch((e) => {
    throw e;
})
.finally(async () => {
   await prisma.$disconnect();
});
*/


/*
function private_routes(fastify_instance, options, next) {

	fastify_instance.post('/user', async (req, res) => { 
console.log('# /user');
console.log(req.body);

		const { useremail, password } = req.body;
		// if (username != "uu" ) 
		// 	return res.status(401).send("Invalid user or password");
		// if (password != "1234" ) 
		// 	return res.status(401).send("Invalid user or password");


		try {
console.log(useremail);
var userByEmail = await prisma.user.findUnique({
	where: {
	  email: useremail,
	},
  });
console.log('userByEmail:');
console.log(userByEmail);


		}
		catch(error) {
			return res.status(401).send("Invalid user or password");
		}


//                              VVV
const token = jwt.sign({userId: userByEmail.id}, 'supersecretcode-CHANGE_THIS-USE_ENV_FILE' );

		return (res.status(200).cookie("ft_transcendence_jwt", token, {
			path: "/",
						httpOnly: true,
						sameSite: "none",
						secure: true
					}).send(""));
	//                  }).send({ response: "successfully logged in", need2fa: true }));

	})

	fastify_instance.post('/newuser', async (req, res) => { 
console.log('# /newuser');
console.log(req.body);

//		const { username, useremail, password } = req.body;

		try {
			const email = req.body.useremail;
			const name = req.body.username;
			const password = req.body.password;

		   let user = await prisma.user.create({
				data: {
					name,
					email,
					password
				}
			})
console.log(user);

console.log('newuser created');

			const token = jwt.sign({userId: user.id}, 'supersecretcode-CHANGE_THIS-USE_ENV_FILE' );

			res.status(200).cookie("ft_transcendence_jwt", token, {
				path: "/",
				httpOnly: true,
				sameSite: "none",
				secure: true
			}).send("");

		}
		catch (error) {

console.log('newuser pancarte');
			res.status(500).send("Error");
		}


	})

	next()
}
*/



fastify.register(fastify_static, {
		root: path.join(__dirname, 'public'),
		prefix: '/public/', // optional: default '/'
	//constraints: { host: 'example.com' } // optional: default {}
	})


fastify.register(fastify_jwt, {
		secret: 'supersecretcode-CHANGE_THIS-USE_ENV_FILE'
	})


function public_routes(fastify_instance, options, next) {
}




fastify.register(private_routes)
//fastify.register(public_routes)




fastify.addHook('preHandler', (req, res, next) => {
console.log("hihihihihi");
//  req.jwt = fastify.jwt


/*
	try {
//		const token = req.cookies['ft_transcendence_jwt'];

//		const decoded = jwt.verify(token, 'supersecretcode-CHANGE_THIS-USE_ENV_FILE');

	} catch (error) {
		return res.status(401).send({ error: 'Invalid token' });
	}
*/

  return next()
})

// cookies
fastify.register(fastify_cookie, {
  secret: 'supersecretcode-CHANGE_THIS-USE_ENV_FILE',
  hook: 'preHandler',
})



//fastify.decorate("authenticate", async function(req, res) {
//})

// JWT verification function
const verifyJWT = async (req, res) => {

	req.user = undefined
	try {
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


// get user info via session or override to admin during dev. Undef if not logged in
//function getUser(session) {
function getUser(user) {

console.log(user);

	if (user == undefined)
		return undefined;

//console.log(`2user ${user}` );

//	if(settings.devLogin) return {id:"1", name:"Admin", isadmin:true, clientaddress:"localhost"};
// //const isadmin = (session.userid == 1);
//  if(session.userid) return {id:session.userid, name:session.username, isadmin:(session.userid == '1')};

	return {id: user.userId};
}



/*
function verifyToken(req, res, next) {
const token = req.header('Authorization');
if (!token) return res.status(401).json({ error: 'Access denied' });
try {
 const decoded = jwt.verify(token, 'your-secret-key');
 req.userId = decoded.userId;
 next();
 } catch (error) {
 res.status(401).json({ error: 'Invalid token' });
 }
 };
*/


fastify.get('/', { preHandler: [verifyJWT] }, function (req, res) {

console.log(`req.user: ${req.user}`);

	const user = getUser(req.user);
	if(user == undefined)
		return res.redirect('/login')

console.log(`user: ${user}`);

 //console.log("***", req.session);

	res.sendFile('index.html')

/*
	res.type('text/html').send(`
		
<!DOCTYPE html>
<html>
    <head>
        <title>Transcendence Test Page HTML</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>



        <div id="home page">
        <p>
            home page uuu
        </p>

        </div>

       <script type="module" src="/public/index.js"></script>

    </body>
</html>
				
	`);
*/

//    console.log('# Home route'); //console.log("***", req.session);

})


fastify.get('/login', function (req, res) {
	res.sendFile('login.html')




//    if(req.session.userid) res.redirect('/');
//    else res.render("login");

})


fastify.get('/signup', function (req, reply) {
	reply.sendFile('signup.html')

//    if(req.session.userid) res.redirect('/');
//    else res.render("login");

})


/*
	fastify.post('/user', (req, res) => { 
		console.log('# /user');
	//	console.log(req.body);

		const { username, password } = req.body;
		if (username != "uu" ) 
			return res.status(401).send("Invalid user or password");
		if (password != "1234" ) 
			return res.status(401).send("Invalid user or password");



		const token = jwt.sign({userId: 123}, 'supersecretcode-CHANGE_THIS-USE_ENV_FILE' );

		return (res.status(200).cookie("ft_transcendence_jwt", token, {
						path: "/",
						httpOnly: true,
						sameSite: "none",
						secure: true
					}).send(""));
	//                  }).send({ response: "successfully logged in", need2fa: true }));



	})
*/




// Run the server!
fastify.listen({ port: 3000 }, (err) => {
  if (err) {
	fastify.log.error(err)
	process.exit(1)
  }
})




/*
import fjwt, { FastifyJWT } from '@fastify/jwt'
import fCookie from '@fastify/cookie'

// jwt
app.register(fjwt, { secret: 'supersecretcode-CHANGE_THIS-USE_ENV_FILE' })

app.addHook('preHandler', (req, res, next) => {
  // here we are
  req.jwt = app.jwt
  return next()
})

// cookies
app.register(fCookie, {
  secret: 'some-secret-key',
  hook: 'preHandler',
})
*/


