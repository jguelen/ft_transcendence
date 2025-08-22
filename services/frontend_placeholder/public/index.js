// Placeholder site

console.log("huhuuhaha");


const urlPageTitle = "ft_transcendence";

// create document click that watches the nav links only
document.addEventListener("click", (e) => {
	const { target } = e;

console.log('popstate')
console.log(target)

	if (!target.matches("nav a")) {
		return;
	}
	e.preventDefault();
	urlRoute();
});

// create an object that maps the url to the template, title, and description
const urlRoutes = {
	404: {
		template: "/public/templates/404.html",
		title: "404 | " + urlPageTitle,
		description: "Page not found",
	},
	"/home": {
		template: "/public/templates/home.html",
		title: "Home | " + urlPageTitle,
		description: "home page",
	},
	"/game": {
		template: "/public/templates/game.html",
		title: "game | " + urlPageTitle,
		description: "game page",
	},
	"/chat": {
		template: "/public/templates/chat.html",
		title: "chat | " + urlPageTitle,
		description: "game page",
	},
	"/settings": {
		template: "/public/templates/settings.html",
		title: "settings | " + urlPageTitle,
		description: "settings page",
	},

	"/login": {
		template: "/public/templates/login.html",
		title: "login | " + urlPageTitle,
		description: "login page",
	},

	"/signup": {
		template: "/public/templates/signup.html",
		title: "signup | " + urlPageTitle,
		description: "signup page",
	},

};

// create a function that watches the url and calls the urlLocationHandler
const urlRoute = (event) => {
	event = event || window.event; // get window.event if event argument not provided
	event.preventDefault();
	// window.history.pushState(state, unused, target link);
	window.history.pushState({}, "", event.target.href);
	urlLocationHandler();
};

// create a function that handles the url location
const urlLocationHandler = async () => {
console.log('popstate')

	var location = window.location.pathname; // get the url path
	// if the path length is 0, set it to primary page route
console.log(location)

	if (location.length == 0) {
console.log('root page req')
		location = "/";
	}
	if (location == '/') {
console.log('root page req2')
		location = "/home";
	}

	var show_nav = "block";
//	if (location == '/login' ) show_nav = "none"
//	if (location == '/signup') show_nav = "none"

	// get the route object from the urlRoutes object
	const route = urlRoutes[location] || urlRoutes["404"]

console.log(route)

	// get the html from the template
	const html = await fetch(route.template).then((response) => response.text());

	// show/hide nav
	document.getElementById("navdiv").style.display = show_nav

	// set the content of the content div to the html
	document.getElementById("pagemaincontent").innerHTML = html;
	// set the title of the document to the title of the route
	document.title = route.title;
	// set the description of the document to the description of the route
	document.querySelector('meta[name="description"]')
	.setAttribute("content", route.description);
};

// add an event listener to the window that watches for url changes
window.onpopstate = urlLocationHandler;

// call the urlLocationHandler function to handle the initial url

window.route = urlRoute;
// call the urlLocationHandler function to handle the initial url

urlLocationHandler();





/*
document.getElementById("divgame").style.display = "none"
document.getElementById("divsettings").style.display = "none"


document.getElementById("navbtnhome").addEventListener("click", () => {
	console.log("1");

	document.getElementById("divhome").style.display = "block"
	document.getElementById("divgame").style.display = "none"
	document.getElementById("divsettings").style.display = "none"

//	router();
});


document.getElementById("navbtngame").addEventListener("click", () => {
	console.log("2");

	document.getElementById("divhome").style.display = "none"
	document.getElementById("divgame").style.display = "block"
	document.getElementById("divsettings").style.display = "none"

//	router();
});

document.getElementById("navbtnsettings").addEventListener("click", () => {
	console.log("3");

	document.getElementById("divhome").style.display = "none"
	document.getElementById("divgame").style.display = "none"
	document.getElementById("divsettings").style.display = "block"

//	router();
});




document.addEventListener("DOMContentLoaded", () => {
console.log("huhu");




//	router();
});

*/


/*
const router = async () => {
	const routes = [
		{path: "/", views: () => (console.log("viewing")) },
		{path: "/game", views: () => (console.log("game")) },
		{path: "/profile", views: () => (console.log("profile")) }

	];

	const potentialMatches = routes.map(route => {
		return {
			route: route,
			isMatch: location.pathname === route.path
		};

	});

	console.log(potentialMatches);
};

document.addEventListener("DOMContentLoaded", () => {
console.log("huhu");

	router();
});
*/