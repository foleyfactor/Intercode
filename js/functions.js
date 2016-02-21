var ref = new Firebase("https://intercoding.firebaseio.com");
var uid = ref.getAuth().uid;
$(window).bind('beforeunload', function() {
  ref.child("users").child(uid).child("units").child(getUnit()).child("lessons").child(lessonID).child('code').set(prog);
  return true;
});

var myCodeMirror = CodeMirror.fromTextArea(document.getElementById("yourcode"), {
  theme: "monokai",
  value: "hi",
  mode: "python",
  lineNumbers: true
  });

var consoleOut = CodeMirror.fromTextArea(document.getElementById("youroutput"), {
  theme: "monokai",
  value: "hi",
  mode: "SQL",
  readOnly: true
  });

function outf(text) { 
    var mypre = consoleOut.getValue(''); 
    consoleOut.setValue(mypre + text); 
} 
function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
            throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}

function runit() {
   var prog = myCodeMirror.getValue(); 
   var mypre = document.getElementById("youroutput");

   var unitID = getUnit();
   console.log(unitID);

   if (!ref.getAuth()) {
     window.location.replace("index.html");
   }
   //Need lesson and unit ID in order to update the text
   ref.child("users").child(uid).child("units").child(unitID).child("lessons").child(lessonID).child('code').set(prog);
   consoleOut.setValue(''); 
   Sk.pre = "output";
   Sk.configure({output:outf, read:builtinRead}); 
   (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'mycanvas';
   var myPromise = Sk.misceval.asyncToPromise(function() {
       return Sk.importMainWithBody("<stdin>", false, prog, true);
   });
   myPromise.then(function(mod) {
       //console.log('success');
   },
       function(err) {
       consoleOut.setValue(err.toString());
   });

   var outputVerify;
   var inputVerify;
   ref.once('value', function(snapshot) {
    var temp = snapshot.child("users").child(uid).child("units").child(unitID).child("lessons").child(lessonID).val();
    outputVerify = temp['output'];
    inputVerify = temp['input'];
   })

   if (verifyLesson(inputVerify, outputVerify)) {
      //do stuff if the lesson is correct.
   } else {
      //tell them they're wrong
   }
}

function loadLesson() {
  var uid = ref.getAuth().uid;
  var text, code,title;
  var unitID = getUnit();
  ref.once('value', function(snapshot) {
    title = snapshot.child("units").child(unitID).child("name").val();
    var checkForExisting = snapshot.child("users").child("")
    text = snapshot.child("units").child(unitID).child("lessons").child(lessonID).child("text").val();
    text = text.format
    code = snapshot.child("units").child(unitID).child("lessons").child(lessonID).child("code").val();
    code = code.format({a: generateWord(themes['cars'])});
    myCodeMirror.setValue(code);
    consoleOut.setValue("Output goes here!");
    console.log(text);
    $("header h1").text(title);
    $("#lesson-text").text(text);
    $(".spinner").css("display", "none");
    $("#main").css("display", "initial");
    myCodeMirror.refresh();
    consoleOut.refresh();
  });
}

function verifyLesson(inp, out) {
  var codeOut = consoleOut.getValue();
  var codeIn = myCodeMirror.getValue();
  for (var i=0; i<out.length; i++) {
    var includes = true;
    var check = out[i];
    if (check.substring(0, 1) === '!') {
      includes = false;
      check = check.substring(1, check.length);
    }
    if (includes) {
      if (!(codeOut.indexOf(check) > -1)) {
        return false;
      }
    } else {
      if (codeOut.indexOf(check) > -1) {
        return false;
      }
    }
  }

  for (var i=0; i<inp.length; i++) {
    var includes = true;
    var check = inp[i];
    if (check.substring(0, 1) === '!') {
      includes = false;
      check = check.substring(1, check.length);
    }
    if (includes) {
      if (!(codeIn.indexOf(check) > -1)) {
        return false;
      }
    } else {
      if (codeIn.indexOf(check) > -1) {
        return false;
      }
    }
  }
  return true;
}

function getUnit() {
  return JSON.parse(localStorage.getItem("unit"));
}

function next() {
  lessonID ++;
  ref.once('value', function(snapshot) {
    if (snapshot.child("users").child(uid).child("units").child(unitID).child("lessons").numChildren() < lessonID) {
      window.location.replace("learning.html");
    } else if (snapshot.child("users").child(uid).child("units").child(unitID).child("lessons").numChildren() === lessonID) {
      $('#next').text("Finish");
      loadLesson(uid);
    } else {
      loadLesson(uid);
    }
  });
}

String.prototype.format = function (arguments) {
    var this_string = '';
    for (var char_pos = 0; char_pos < this.length; char_pos++) {
        this_string = this_string + this[char_pos];
    }

    for (var key in arguments) {
        var string_key = '{' + key + '}'
        this_string = this_string.replace(new RegExp(string_key, 'g'), arguments[key]);
    }
    return this_string;
};
