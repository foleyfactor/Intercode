var ref = new Firebase("https://intercoding.firebaseio.com");
var dataSaver;
var uid;
$(document).ready(function(){
  if(!ref.getAuth()){
    window.location.href="index.html";
  }
  uid = ref.getAuth().uid;
  dataSaver = window.setInterval(saveCode, 10000);
});

$(window).on('unload', function() {
  window.clearInterval(dataSaver);
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
    if (verifyLesson(inputVerify, outputVerify)) {
      $('#next').css('display', 'inline-block');

      if (snapshot.child("units").child(unitID).child("lessons").numChildren() === lessonID) {
        $("#next").text("FINISH");
      }
      if(!snapshot.child("users").child(uid).child("units").child(unitID).child("lessons").child(lessonID).child("completed").val()){
        addPoints(snapshot.child("units").child(unitID).child("difficulty").val());
        if (snapshot.child("units").child(unitID).child("lessons").numChildren() == lessonID) {
          addLevel();
        }
      }
      $(".wrongnoti").css("display", "none");
      $("#console-wrapper").removeClass("wrong");
      $("#console-wrapper").addClass("right");
      ref.child("users").child(uid).child("units").child(unitID).child("lessons").child(lessonID).child("completed").set(true);
    } else {
      notQuite();
    }
   });
   
}

function notQuite(){
  $("#next").css("display", "none");
  $(".wrongnoti").css("display", "inline-block")
  $("#console-wrapper").removeClass("right");
  $("#console-wrapper").addClass("wrong");
}

function addPoints(difficulty){
  var points;
  if(difficulty=="BEGINNER"){
    points = 5;
  } else if (difficulty=="INTERMEDIATE"){
    points = 10;
  } else {
    points = 25;
  }
  ref.once("value", function(snapshot){
    var current = snapshot.child("users").child(uid).child("score").val();
    ref.child("users").child(uid).child("score").set(current+points);
    $("#points").text("+"+points+" points");
    togglePoints();
    window.setTimeout(togglePoints, 2000);

  });
}

function addLevel(){
  ref.once("value", function(snapshot){
    var current = snapshot.child("users").child(uid).child("unlocked").val();
    ref.child("users").child(uid).child("unlocked").set(current+1);
  });
}

function loadLesson() {
  if(!ref.getAuth()){
    window.location.href="index.html"
  }
  var uid = ref.getAuth().uid;
  var text, code, title, output, input, alreadyCompleted;
  var unitID = getUnit();
  ref.once('value', function(snapshot) {
    title = snapshot.child("units").child(unitID).child("name").val();
    var currTheme = snapshot.child("users").child(uid).child('units').child(unitID).child('theme').val();
    var generatedArray = generateArray(themes[currTheme]);
    var existingText = snapshot.child("users").child(uid).child("units").child(unitID).child("lessons").child(lessonID).child("text").val();
    var existingCode = snapshot.child("users").child(uid).child("units").child(unitID).child("lessons").child(lessonID).child("code").val();
    var existingInput = snapshot.child("users").child(uid).child("units").child(unitID).child("lessons").child(lessonID).child("input").val();
    var existingOutput = snapshot.child("users").child(uid).child("units").child(unitID).child("lessons").child(lessonID).child("output").val();
    var alreadyCompleted = snapshot.child("users").child(uid).child("units").child(unitID).child("lessons").child(lessonID).child("completed").val();
    if (! existingText) {
      text = snapshot.child("units").child(unitID).child("lessons").child(lessonID).child("text").val();
      text = text.format({a: generatedArray[0], b: generatedArray[1], c: generatedArray[2], d: generatedArray[3], e: generatedArray[4], f: generatedArray[5], g: generatedArray[6], h: generatedArray[7], i: generatedArray[8], j: generatedArray[9]});
      ref.child("users").child(uid).child("units").child(unitID).child("lessons").child(lessonID).child("text").set(text);
      code = snapshot.child("units").child(unitID).child("lessons").child(lessonID).child("code").val();
      code = code.format({a: generatedArray[0], b: generatedArray[1], c: generatedArray[2], d: generatedArray[3], e: generatedArray[4], f: generatedArray[5], g: generatedArray[6], h: generatedArray[7], i: generatedArray[8], j: generatedArray[9]});
      ref.child("users").child(uid).child("units").child(unitID).child("lessons").child(lessonID).child("code").set(code);
      input = snapshot.child("units").child(unitID).child("lessons").child(lessonID).child("input").val();
      for (var i=0; i<input.length; i++) {
        input[i] = input[i].format({a: generatedArray[0], b: generatedArray[1], c: generatedArray[2], d: generatedArray[3], e: generatedArray[4], f: generatedArray[5], g: generatedArray[6], h: generatedArray[7], i: generatedArray[8], j: generatedArray[9]});
      }
      ref.child("users").child(uid).child("units").child(unitID).child("lessons").child(lessonID).child("input").set(input);
      output = snapshot.child("units").child(unitID).child("lessons").child(lessonID).child("output").val();
      for (var i=0; i<output.length; i++) {
        output[i] = output[i].format({a: generatedArray[0], b: generatedArray[1], c: generatedArray[2], d: generatedArray[3], e: generatedArray[4], f: generatedArray[5], g: generatedArray[6], h: generatedArray[7], i: generatedArray[8], j: generatedArray[9]});
      }
      ref.child("users").child(uid).child("units").child(unitID).child("lessons").child(lessonID).child("output").set(output);
    } else {
      text = existingText;
      code = existingCode;
      input = existingInput;
      output = existingOutput;
    }

    if (alreadyCompleted) {
      $("#next").css("display", "inline-block");
    } else {
      $("#next").css("display", "none");
    }

    myCodeMirror.setValue(code);
    consoleOut.setValue("Output goes here!");
    $("header h1").text(title);
    $("#lesson-text").html(text);
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
  window.clearInterval(dataSaver);
  unitID = getUnit();
  lessonID ++;
  ref.once('value', function(snapshot) {
    if (snapshot.child('units').child(unitID).child('lessons').numChildren() < lessonID) {
      window.location.replace("learning.html");
    } else if (snapshot.child("units").child(unitID).child("lessons").numChildren() === lessonID) {
      loadLesson();
      dataSaver = window.setInterval(saveCode, 10000);
    } else {
      loadLesson();
      dataSaver = window.setInterval(saveCode, 10000);
    }
  });
}

function saveCode() {
  var unitID = getUnit();
  var code = myCodeMirror.getValue();
  autosaved();
  ref.child("users").child(uid).child("units").child(unitID).child("lessons").child(lessonID).child("code").set(code);
}

function autosaved() {
  toggle();
  window.setTimeout(toggle, 2000);
}

function toggle() {
  $("#autosave").fadeToggle(1500);
}
function togglePoints() {
  $("#points").fadeToggle(1500);
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

$("#next").on('click', function() {
  $("#console-wrapper").removeClass("right");
  next();
});