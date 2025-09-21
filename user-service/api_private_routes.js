// api_private_routes.js

const { prisma } = require('./index.js')

const { API_PASSPHRASE } = process.env


exports.api_private_routes = function(fastify_instance, options, next) {

    fastify_instance.addHook('preValidation', (req, res, done) =>  {
console.log(req.body);	

        if (req.body?.api_passphrase != API_PASSPHRASE) {
console.log("api_private_routes");	
            return res.status(401).send();
        }
        done()
    })


    fastify_instance.post('/api/user/getbyemail/:email', {}, async function (req, res) {
console.log("POST /api/user/getbyemail/:email");
console.log(req.params.email);

        const value = req.params.email;
        try {
            var user = await prisma.user.findUnique({
                where: { 
                    email: value
                }
            })
console.log(user)
            if (user == null)
                return res.status(404).send()
            return res.status(200).send(user)
        }
        catch (error) {
            console.log(error)
            res.status(500).send()
        }
    })

    next()
}
