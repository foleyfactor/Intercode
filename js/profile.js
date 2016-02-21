var ref = new Firebase("https://intercoding.firebaseio.com");
var points;
$(document).ready(function(){
	if(!ref.getAuth()){
		window.location.replace("index.html");
	} else {
		$("#profilepic").attr("src", ref.getAuth().password.profileImageURL+"&s=200");
		$(".welcome").append("<b> "+ref.getAuth().password.email+"</b>.");
		ref.once("value", function(snapshot){
			points=snapshot.child("users").child(ref.getAuth().uid).child("score").val();
			if(!points){
				points=0
			}
			$(".points").append("<b> "+points+"</b> points.");
			$("#profile-wrapper").css("display", "block");
			$(".spinner").css("display", "none");
			var users = snapshot.child("users").val();
			var ranking = 1;
			for (var key in users){
				var user = users[key];
				if (user.score>points){
					ranking++
				}
			}
			$(".ranking").append("<b>#"+ranking+"</b> in the world!")
		});
		
	}
});