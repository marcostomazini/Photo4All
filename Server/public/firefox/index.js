

function getPhoto() {
	var getphoto = new MozActivity({
	  name: "pick",
	  data: {
		type: ["image/png", "image/jpg", "image/jpeg"]
	  }
	});

	getphoto.onsuccess = function () {
	  var img = document.createElement("img");
	  if (this.result.blob.type.indexOf("image") != -1) {
		img.src = window.URL.createObjectURL(this.result.blob);
		//https://photo4ffx.herokuapp.com/firefox/id.html
		document.location = "https://photo4ffx.herokuapp.com/firefox/id.html#1234";
	  }
	};

	getphoto.onerror = function () { 
		// erro!
	};
}	
