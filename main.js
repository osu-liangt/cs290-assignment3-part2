function clearFavorites() {
	document.getElementById("clearFavorites").onclick = function() {
		populateStorage();
		var favorites = document.getElementById("favorites");
		favorites.innerHTML = "";
		document.getElementById("clearFavorites").style.display = "none";
	}
};

function searchButton() {

	// Establish AJAX functionality for search button

	document.getElementById("searchGistsButton").onclick = function() {

		// Clear existing contents

		var other = document.getElementById("other");
		other.innerHTML = "";

		// Create a new GIST Response object from the AJAX request

		var GISTResponse = [];
		var httpRequest = new XMLHttpRequest();

		function requestCheck() {
		  if (httpRequest.readyState === 4) {
		    if (httpRequest.status === 200) {
		      displayResults(JSON.parse(httpRequest.responseText));
		    } else {
		      alert('There was a problem with the request.');
		    }
		  }
		}

		httpRequest.onreadystatechange = requestCheck;

		httpRequest.open('GET', 'https://api.github.com/gists/public');
		httpRequest.send(null);

	};

};

function displayResults(GISTResponse) {

	// The section labeled, "other"
	var other = document.getElementById("other");
	var i;

	for (i = 0; i < GISTResponse.length; i++) {

		var gistFavorites = JSON.parse(localStorage["favorites"]);
		var j;
		var favoritedGist = false;

		for (j = 0; j < gistFavorites.length; j++) {
			if (gistFavorites[j].id == GISTResponse[i].id) {
				favoritedGist = true;
				break;
			}
		}

		if (!favoritedGist) {
			var gistBlock = document.createElement("div");
			gistBlock.className = "gist-block";

			var gistURL = GISTResponse[i].html_url
			var gistDescription = GISTResponse[i].description;
			if (gistDescription == "" || gistDescription == null) {
				gistDescription = "[No Description]";
			}
			var gistDescriptionNode = document.createTextNode(gistDescription);		

			var gistLink = document.createElement("a");
			gistLink.appendChild(gistDescriptionNode);
			gistLink.href = GISTResponse[i].html_url;

			var gistAddFavoritesButton = new AddFavoritesButton(GISTResponse[i]);

			gistBlock.appendChild(gistAddFavoritesButton);
			gistBlock.appendChild(gistLink);
			// Because HTML ID's cannot start with digits
			gistBlock.id = "gist-" + GISTResponse[i].id;
			
			other.appendChild(gistBlock);
		}
	}
};

function AddFavoritesButton(gist) {
	var newButton = document.createElement("button");
	newButton.className = "add-favorites";
	newButton.appendChild(document.createTextNode("Add to Favorites"));
	newButton.onclick = function () {
		addFavorite(gist)
	};
	return newButton;
};

function RemoveFavoritesButton(gist) {
	var newButton = document.createElement("button");
	newButton.className = "remove-favorites";
	newButton.appendChild(document.createTextNode("Remove from Favorites"));
	newButton.onclick = function () {
		removeFavorite(gist)
	};
	return newButton;
}

function populateStorage() {
	var gistFavorites = [];
	localStorage["favorites"] = JSON.stringify(gistFavorites);
};

function addFavorite(gist) {

	var favorites = document.getElementById("favorites");

	document.getElementById("clearFavorites").style.display = "block";

	var gistFavorites = JSON.parse(localStorage["favorites"]);
	var i;
	gistFavorites.push(gist);
	localStorage["favorites"] = JSON.stringify(gistFavorites);

	var others = document.getElementById("other");

	var gistBlockToRemove = document.getElementById("gist-" + gist.id);
	others.removeChild(gistBlockToRemove);

	var gistBlock = document.createElement("div");
	gistBlock.className = "gist-block";

	var gistURL = gist.html_url
	var gistDescription = gist.description;
	if (gistDescription == "" || gistDescription == null) {
		gistDescription = "[No Description]";
	}
	var gistDescriptionNode = document.createTextNode(gistDescription);		

	var gistLink = document.createElement("a");
	gistLink.appendChild(gistDescriptionNode);
	gistLink.href = gist.html_url;

	var gistRemoveFavoritesButton = new RemoveFavoritesButton(gist);

	gistBlock.appendChild(gistRemoveFavoritesButton);
	gistBlock.appendChild(gistLink);
	// Because HTML ID's cannot start with digits
	gistBlock.id = "gist-" + gist.id;
	
	favorites.appendChild(gistBlock);

};

function removeFavorite(gist) {

	var favorites = document.getElementById("favorites");
	var gistBlockToRemove = document.getElementById("gist-" + gist.id);
	favorites.removeChild(gistBlockToRemove);

	var gistFavorites = JSON.parse(localStorage["favorites"]);
	var i;

	for (i = 0; i < gistFavorites.length; i++) {
		if (gistFavorites[i].id == gist.id) {
			gistFavorites.splice(i, 1);
			break;
		}
	}

	if (gistFavorites.length == 0) {
		document.getElementById("clearFavorites").style.display = "none";
	}

	localStorage["favorites"] = JSON.stringify(gistFavorites);

};

function listFavorites() {
	var gistFavorites = JSON.parse(localStorage["favorites"]);
	var i;
	var favorites = document.getElementById("favorites");

	if (gistFavorites.length == 0) {
		document.getElementById("clearFavorites").style.display = "none";
		return;
	}

	for (i = 0; i < gistFavorites.length; i++) {

		var gist = gistFavorites[i];

		var gistBlock = document.createElement("div");
		gistBlock.className = "gist-block";

		var gistURL = gist.html_url
		var gistDescription = gist.description;
		if (gistDescription == "" || gistDescription == null) {
			gistDescription = "[No Description]";
		}
		var gistDescriptionNode = document.createTextNode(gistDescription);		

		var gistLink = document.createElement("a");
		gistLink.appendChild(gistDescriptionNode);
		gistLink.href = gist.html_url;

		var gistRemoveFavoritesButton = new RemoveFavoritesButton(gist);

		gistBlock.appendChild(gistRemoveFavoritesButton);
		gistBlock.appendChild(gistLink);
		// Because HTML ID's cannot start with digits
		gistBlock.id = "gist-" + gist.id;
		
		favorites.appendChild(gistBlock);
	}
}

window.onload = function() {

	// If favorites not set, set it
	if(!localStorage.getItem('favorites')) {
		populateStorage();
	}

	// Set functionality of clear favorites button
	clearFavorites();

	listFavorites();

	// Set functionality for search button
	searchButton();
	
};