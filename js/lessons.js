var ref = new Firebase("https://intercoding.firebaseio.com");
$(document).ready(function(){
	if(!ref.getAuth()){
		window.location.replace("index.html");
	}
	createLesson("Simple Loops", "ANIMALS", "BEGINNER", "Ok");
	createLesson("Linked Lists", "DOGS", "INTERMEDIATE", "Ok");
	createLesson("Dijkstra's Algorithm", "CATS", "HARD", "Ok");
});

function createLesson(title, tag, level,lesson){
	$("#lessons").append('<li class="lessonitem"><div class="lessonitemleft"> \
		<h1 class="lessontitle">'+title+'</h1> \
		<span class="tag '+level+'">'+level+'</span>\
		<span class="tag theme">'+tag+'</span></div>\
	<div class="lessonitemright"><a href="#" class="button">GO &#9656;</a></div></li>');
}