function displayResults(GISTResponse) {
	var body = document.getElementsByTagName("body")[0];
	body.appendChild(document.createTextNode(GISTResponse[0].url))	
}

window.onload = function() {

	document.getElementById("getGistsButton").onclick = function() {

		// Create a new GIST Response object from the AJAX request

		var GISTResponse = [];
		var httpRequest = new XMLHttpRequest();

		function alertContents() {
		  if (httpRequest.readyState === 4) {
		    if (httpRequest.status === 200) {
		      displayResults(JSON.parse(httpRequest.responseText));
		    } else {
		      alert('There was a problem with the request.');
		    }
		  }
		}

		httpRequest.onreadystatechange = alertContents;

		httpRequest.open('GET', 'https://api.github.com/gists/public');
		httpRequest.send(null);

	};

};