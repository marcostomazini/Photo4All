//
// socket.io code
//
var socket = io.connect();
var idConexao = "";
var slides = new Array();
// retorno
socket.on('announcement', function (msg) {
	//alert(msg);
	//$('#lines').append($('<p>').append($('<em>').text(msg)));
});
    
socket.on('close', function (msg) {
	//alert('Close server: ' + msg);
	location.reload();
});

socket.on('user image', image);

socket.on('reconnect', function () {
	message('System', 'Reconnected to the server');
});

socket.on('error', function (e) {
	message('System', e ? e : 'A unknown error occurred');
});

function image (from, data) {
	slider(data.image);
	socket.emit('reply ok', from);
}

function rand(length, current){
	current = current ? current : '';
	return length ? rand( --length , "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".charAt( Math.floor( Math.random() * 60 ) ) + current ) : current;
}

function init(rand) {
	idConexao = rand;
	socket.emit('userid', { to: "null", from: idConexao }, function (set) {
		if (!set) {	
		  $('#idConexao').html("connection id: " + idConexao);
		  $("#qrImage").html('<img src="https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=' + idConexao + '&chld=L%7C0" alt="1"/>');
		  return true;
		}
		init(rand(6));
	});
	return false;
}	

function slider(image1) {			
	var obj = {
		image : image1, 
		title : 'Marcos Tomazini', 
		thumb : image1
	};
	slides.push(obj);		
	
	$("#thumb-list").remove(); //remove the actual thumb list if exist
	$("#supersized").empty(); //remove the background image if exist
	$.supersized({
		// Functionality
		transition              :   6, 			// 0-None, 1-Fade, 2-Slide Top, 3-Slide Right, 4-Slide Bottom, 5-Slide Left, 6-Carousel Right, 7-Carousel Left
		transition_speed		:	1000,		// Speed of transition
		keyboard_nav            :   1,			// Keyboard navigation on/off
		performance				:	3,			// 0-Normal, 1-Hybrid speed/quality, 2-Optimizes image quality, 3-Optimizes transition speed // (Only works for Firefox/IE, not Webkit)
		image_protect			:	0,			// Disables image dragging and right click with Javascript
		autoplay				:	0,			// Slideshow starts playing automatically
		
		// Size & Position						   
		min_width		        :   0,			// Min width allowed (in pixels)
		min_height		        :   0,			// Min height allowed (in pixels)
		vertical_center         :   0,			// Vertically center background
		horizontal_center       :   0,			// Horizontally center background
		fit_always				:	0,			// Image will never exceed browser width or height (Ignores min. dimensions)
		fit_portrait         	:   0,			// Portrait images will not exceed browser height
		fit_landscape			:   0,			// Landscape images will not exceed browser width
		
		slides      			:   slides
	});
	
	//api.goTo(vars.current_slide + 1);
	api.goTo(slides.length);
	$("#panelImg").hide();
	//api.nextSlide();	
}
//
// dom manipulation code
//
$(function () {
	// run the code in the markup!
	init(rand(6));
});
