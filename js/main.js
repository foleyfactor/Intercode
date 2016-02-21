var ref = new Firebase("https://intercoding.firebaseio.com");
$(document).ready(function(){
	if(ref.getAuth()){
		window.location.replace("learning.html");
	}
	$("#getstarted").on("click", function(){
		$("#signuparea").removeClass("shake");
		$("#loginarea").removeClass("shake");
		$('#signuparea').lightbox_me({
	        centered: true, 
	        onLoad: function() { 
	            $('#signuparea').find('input:first').focus()
            }
        });
	});

	$("#signup").on("click", function(){
		$(".notloading").css("display", "none");
		$(".spinner").css("display", "block");
		$("#signuparea").removeClass("shake");
		ref.createUser({
			email: $("#signemail").val(),
			password: $("#signpassword").val()
		}, function(error, userData){
		  if (error) {
		  	$(".notloading").css("display", "block");
			$(".spinner").css("display", "none");
		  	$("#signuparea").addClass("shake");
		    console.log("Error creating user:", error);
		  } else {
		  	console.log("Signed up!")
		    ref.authWithPassword({
				email    : $("#signemail").val(),
				password : $("#signpassword").val()
			}, function(error, authData) {
				if (error) {
					console.log("Login Failed!", error);
					$(".notloading").css("display", "block");
					$(".spinner").css("display", "none");
					$("#signuparea").addClass("shake");
				} else {
					ref.child("users").child(ref.getAuth().uid).child("active").push().set("default");
					window.location.replace("learning.html");
			  	}
			});
		  }
		});
	});

	$("#loginlink").on("click", function(){
		$("#loginarea").removeClass("shake");
		$("#signuparea").trigger("close");
		$("#loginarea").lightbox_me({
	        centered: true, 
	        onLoad: function() { 
	            $('#signuparea').find('input:first').focus()
            }
        });
	})

	$("#login").on("click", function(){
		$("#loginarea").removeClass("shake");
		$(".notloading").css("display", "none");
		$(".spinner").css("display", "block");
        ref.authWithPassword({
			email    : $("#logemail").val(),
			password : $("#logpassword").val()
		}, function(error, authData) {
			if (error) {
				console.log("Login Failed!", error);
				$(".notloading").css("display", "block");
				$(".spinner").css("display", "none");
				$("#loginarea").addClass("shake");
			} else {
				window.location.replace("learning.html");
		  	}
		});
	});

	$("#resignup").on("click", function(){
		$("#signuparea").removeClass("shake")
		$("#loginarea").trigger("close");
		$("#signuparea").lightbox_me({
	        centered: true, 
	        onLoad: function() { 
	            $('#signuparea').find('input:first').focus()
            }
        });
	});
});