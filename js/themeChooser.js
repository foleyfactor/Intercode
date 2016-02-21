var ref = new Firebase("https://intercoding.firebaseio.com");
var uid;
$(document).ready(function(){
	if(!ref.getAuth()){
		window.location.href="index.html";
	}
	uid = ref.getAuth().uid;
	var activeThemes;
	ref.once("value", function(snapshot){
		activeThemes = snapshot.child("users").child(uid).child("active").val();
		populateThemes(activeThemes);
	});
	
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
		if(theme=="default"){
			continue;
		}
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
	if ($("."+theme).hasClass("active")){
		$("."+theme).removeClass("active");
		ref.once("value", function(snapshot){
			var value = snapshot.child("users").child(uid).child("active").val()
			for (var key in value) {
				if (value[key]!=theme){
					continue
				} else {
					ref.child("users").child(uid).child("active").child(key).remove();
				}
			}
			
		});
	} else {
		var pushRef = ref.child("users").child(uid).child("active").push();
			$("."+theme).addClass("active");
			pushRef.set(theme);
	}
}