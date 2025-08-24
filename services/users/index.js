// npm i fastify
 

//@fastify/static
// npm i @fastify/cookie
// npm i @fastify/jwt
// npm i sqlite3
// npm i prisma --save-dev


const fastify = require('fastify')({ logger: false })



fastify.addHook('preHandler', (req, res, next) => {
console.log("hohohoho");
//  req.jwt = fastify.jwt

res.header("Access-Control-Allow-Origin", "*")
 res.header("Access-Control-Allow-Methods", "*");
 res.header("Access-Control-Allow-Headers",  "*");


  const isPreflight = /options/i.test(req.method);
  if (isPreflight) {
    return res.send();
  }


  return next()
})

/*
 res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST");
    res.header("Access-Control-Allow-Headers",  "*");
*/




fastify.post('/api/newuser', {}, function (req, res) {

console.log('# /newuser');
console.log(req.body);


 	res.send('')
})




// Run the serveur!
fastify.listen({ port: 3002 }, (err) => {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
})
