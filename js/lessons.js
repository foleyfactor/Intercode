var ref = new Firebase("https://intercoding.firebaseio.com");
var uid;
$(document).ready(function(){
	if(!ref.getAuth()){
		window.location.replace("index.html");
	}
	uid = ref.getAuth().uid;
	var level;
	ref.once("value", function(snapshot){
		level = snapshot.child("users").child(uid).child("completed").val();
	});
	if(!level){
		ref.child("users").child(uid).child("completed").set(1);
		level = 1;
	}
	ref.once("value", function(snapshot){
		$("#main").css("display", "block");
		$(".spinner").css("display", "none");
		for (var i = 1; i <= level; i++) {
			var lesson = snapshot.child("units").child(i).val();
			createLesson(lesson.name, "TBD", lesson.difficulty, i);
		}
	});
});

function createLesson(title, tag, level, unit){
	$("#lessons").append('<li class="lessonitem"><div class="lessonitemleft"> \
		<h1 class="lessontitle">'+title+'</h1> \
		<span class="tag '+level+'">'+level+'</span>\
		<span class="tag theme">'+tag+'</span></div>\
	<div class="lessonitemright"><a href="lesson.html" unit="' + unit + '" class="button" onclick="setUnit('+unit+');">GO &#9656;</a></div></li>');
}
function setUnit(unitID) {
	localStorage.setItem("unit", unitID);
}