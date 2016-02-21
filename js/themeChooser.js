var ref = new Firebase("https://intercoding.firebaseio.com");
var uid;
$(document).ready(function(){
	uid = ref.getAuth().uid;
	var activeThemes;
	ref.once("value", function(snapshot){
		activeThemes = snapshot.child("users").child(uid).child("active").val();
		populateThemes(activeThemes);
	})
	
});

function displayChoices(){
	$("#themes").lightbox_me({
        centered: true
    });
}
function closeChoices(){
	$("#themes").trigger("close");
}
function populateThemes(active){
	for (var theme in themes){
		var isActive = false;
		for(var key in active){
			if (active[key]==theme){
				isActive=true;
				break;
			}
		}

		if(isActive){
			$("#themes").append('<div class="theme '+theme+' active" onclick="addTheme(&quot;'+theme+'&quot;)">'+theme+'</div>');
		} else {
			$("#themes").append('<div class="theme '+theme+'" onclick="addTheme(&quot;'+theme+'&quot;)">'+theme+'</div>')
		}
	}
	$("#themes").append('<br><br><br><a class="button big" onclick="closeChoices()">ALL GOOD</a><br><br><br>');
}

function addTheme(theme){
	ref.once("value", function(snapshot){
		activeThemes = snapshot.child("users").child(uid).child("active").val();
		var inDB = false;
		for(var key in activeThemes){
			if (activeThemes[key]==theme){
				inDB = true;
				break;
			}
		}
		if(inDB){
			ref.child("users").child(uid).child("active").child(key).remove();
			$("."+theme).removeClass("active");
		} else {
			var pushRef = ref.child("users").child(uid).child("active").push();
			$("."+theme).addClass("active");
			pushRef.set(theme);
		}
	});
}