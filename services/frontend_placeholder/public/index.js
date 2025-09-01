// Placeholder site

console.log("huhuuhaha")
console.log(window.location.pathname)




const urlPageTitle = "ft_transcendence";

document.getElementById("lang_en").addEventListener("click", (e) => {
console.log('clicken')
	e.preventDefault();
})

/*
document.getElementById("navdiv").addEventListener("click", (e) => {
console.log('click')
	const { target } = e;

	if (!target.matches("nav a")) {
		return;
	}

	e.preventDefault();
	urlRoute();
})
*/

/*
// create document click that watches the nav links only
document.addEventListener("click", (e) => {
	const { target } = e;

console.log('click')
console.log(target)

	if (!target.matches("nav a")) {
		return;
	}

	e.preventDefault();
	urlRoute();
});
*/



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
		description: "chat page",
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
console.log('urlRoute')
console.log(event)

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
	if (location == '/login' ) show_nav = "none"
	if (location == '/signup') show_nav = "none"

	// get the route object from the urlRoutes object
	const route = urlRoutes[location] || urlRoutes["404"]

console.log(route)

	// get the html from the template
	const html = await fetch(route.template).then((response) => response.text());

	// show/hide nav
	document.getElementById("navdiv").style.display = show_nav

	// set the content of the content div to the html
	var my_div = document.getElementById("pagemaincontent")
	my_div.innerHTML = html;
	var arr = my_div.getElementsByTagName('script')

	if (arr[0]) {
console.log(arr[0].src)
		var newScript = document.createElement("script");
		newScript.src = arr[0].src;
		my_div.appendChild(newScript);
	}


//	for (var n = 0; n < arr.length; n++)
//		eval(arr[n].innerHTML)

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
document.addEventListener("DOMContentLoaded", () => {
console.log("huhu");

	router();
});
*/
