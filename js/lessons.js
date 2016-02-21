var ref = new Firebase("https://intercoding.firebaseio.com");
var uid;
$(document).ready(function(){
	if(!ref.getAuth()){
		window.location.replace("index.html");
	}
	uid = ref.getAuth().uid;
	var level;
	ref.once("value", function(snapshot){
		level = snapshot.child("users").child(uid).child("unlocked").val();
		if(!level){
			ref.child("users").child(uid).child("unlocked").set(1);
			level = 1;
		}
		$("#main").css("display", "block");
		$(".spinner").css("display", "none");
		for (var i = 1; i <= level; i++) {
			var lesson = snapshot.child("units").child(i).val();
			var theme = snapshot.child("users").child(uid).child('units').child(i).child('theme').val();
			if (!theme) {
				var active = snapshot.child("users").child(uid).child("active").val();
				theme = generateUnit(objectToList(active));
				ref.child("users").child(uid).child('units').child(i).child('theme').set(theme);
			}
			createLesson(lesson.name, theme.toUpperCase(), lesson.difficulty, i);
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