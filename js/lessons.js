var ref = new Firebase("https://intercoding.firebaseio.com");
$(document).ready(function(){
	if(!ref.getAuth()){
		window.location.replace("index.html");
	}
	createLesson("Simple Loops", "ANIMALS", "BEGINNER", 1);
	createLesson("Linked Lists", "DOGS", "INTERMEDIATE", 2);
	createLesson("Dijkstra's Algorithm", "CATS", "HARD", 3);
});

function createLesson(title, tag, level, unit){
	$("#lessons").append('<li class="lessonitem"><div class="lessonitemleft"> \
		<h1 class="lessontitle">'+title+'</h1> \
		<span class="tag '+level+'">'+level+'</span>\
		<span class="tag theme">'+tag+'</span></div>\
	<div class="lessonitemright"><a href="#" unit="' + unit + '" class="button">GO &#9656;</a></div></li>');
}

$('.button').on('click', function() {
	setUnit($(this).attr("unit"))
	window.location.href("lesson.html");
})