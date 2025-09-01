const fastify = require('fastify')({ logger: false })


fastify.get('/', {}, (request, response) => {
	response.status(200).send("Coucou !")

} )



fastify.get('/uu', {}, (request, response) => {

const mavalue = 'uu'

	response.status(200).headers({ 'content-type': 'text/html; charset=utf-8' }).send(`<!DOCTYPE html>
		<html>
	<head>
		<title>Transcendence Test Page HTML</title>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="description" content="">
	</head>
	<body>

	<div id="langselector">
		<button id="lang_en">English</button>
		<button id="lang_fr">Français</button>
	</div>

		<div id="navdiv" display="none">
			<h2>ft_transcendence frontend placeholder</h2>
<a href="/profile">Profile</a>
<a href="/account">Account</a>

			<nav>
				<a href="/home">Home</a>
				<a href="/game">Game</a>
				<a href="/chat">Chat</a>
				<a href="/settings">Settings</a>
			</nav>
		</div>
Bonjour ${mavalue}


		<div id="pagemaincontent"></div>

		<script type="module" src="/public/index.js"></script>

	</body>
</html>`)

} )



// Run the serveur!
fastify.listen({ port: 3000 }, (err) => {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
})
/*
class vect2 {


private:
 int x, y;

operator*(this, const vect2& )

};


vect2 operator*(int scalar, const vect2& )



int operator[] (int index) {
	if (!index) return x;
	return y;
}

int& operator[] (int index) {
	if (!index) return x;
	return y;
}

v[0] = 123;

v.operator[](0).operator=(123)
*/


/*
	response.status(200).headers({ 'content-type': 'text/html; charset=utf-8' }).send(`<!DOCTYPE html>
<html>
	<head>
		<title>Transcendence Test Page HTML</title>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="description" content="">
	</head>
	<body>

	<div id="langselector">
		<button id="lang_en">English</button>
		<button id="lang_fr">Français</button>
	</div>

		<div id="navdiv" display="none">
			<h2>ft_transcendence frontend placeholder</h2>
<a href="/profile">Profile</a>
<a href="/account">Account</a>

			<nav>
				<a href="/home">Home</a>
				<a href="/game">Game</a>
				<a href="/chat">Chat</a>
				<a href="/settings">Settings</a>
			</nav>
		</div>

		<div id="pagemaincontent"></div>

		<script type="module" src="/public/index.js"></script>

	</body>
</html>`)
*/
