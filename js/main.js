window.index = null;
var index = null;
var $window = $(window);
var win_height_padded = $window.height() + 200;

$( document ).ready(function() {
	index = new Index();
	window.index = index;
	index.initialize();
});