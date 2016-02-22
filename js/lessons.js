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
		var numThemes = objectToList(snapshot.child("users").child(uid).child("active").val()).length;
		if (numThemes === 1) {
			displayChoices();
		}
		
		$("#main").css("display", "block");
		$(".spinner").css("display", "none");
		try{
			for (var i = 1; i <= level; i++) {
				var lesson = snapshot.child("units").child(i).val();
				var theme = snapshot.child("users").child(uid).child('units').child(i).child('theme').val();
				if (!theme) {
					var active = snapshot.child("users").child(uid).child("active").val();
					theme = generateUnit(objectToList(active));
					ref.child("users").child(uid).child('units').child(i).child('theme').set(theme);
				}
				var numLessonsCompleted = snapshot.child("users").child(uid).child("units").child(i).child("lessons").numChildren();
				if(numLessonsCompleted>0){
					var lastValue = snapshot.child("users").child(uid).child("units").child(i).child("lessons").child(numLessonsCompleted).child("completed").val();
					if(!lastValue){
						numLessonsCompleted-=1;
					}
				}
				var numLessonsTotal = snapshot.child("units").child(i).child("lessons").numChildren();
				console.log(numLessonsCompleted/numLessonsTotal)
				createLesson(lesson.name, theme.toUpperCase(), lesson.difficulty, i, (numLessonsCompleted/numLessonsTotal));
			}
		} catch(e){
		}
		
		
	});
});

function createLesson(title, tag, level, unit, progress){
	$("#lessons").append('<li class="lessonitem"><div class="lessonitemleft">\
		<h1 class="lessontitle">'+title+'</h1> \
		<span class="tag '+level+'">'+level+'</span>\
		<span class="tag theme">'+tag+'</span></div>\
	<div class="lessonitemright"><a href="lesson.html" unit="' + unit + '" class="button" onclick="setUnit('+unit+');">GO &#9656;</a><div class="circle circle'+unit+'"></div></div></li>');
	
	$(".circle"+unit).circleProgress({
		value: progress,
        size: 32,
        fill: {
            color : "green"
        }
    });
}
function setUnit(unitID) {
	localStorage.setItem("unit", unitID);
}