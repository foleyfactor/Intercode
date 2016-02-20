var ref = new Firebase("https://intercoding.firebaseio.com");

$(window).bind('beforeunload', function() {
  return 'Are you sure you want to go? Make sure you run your code to save it!';
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
   var uid = ref.getAuth().uid;
   var ref.child("users").child(uid).child(unitID).child(lessonID).child('code').set(prog);
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
    var temp = snapshot.child("users").child(uid).child(unitID).child(lessonID).val();
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
  var text, code;
  var unitID = getUnit();
  ref.once('value', function(snapshot) {
    var temp = snapshot.child(uid).child(unitID).child(lessonID).val();
    text = temp['text'];
    code = temp['code'];
  })
  myCodeMirror.setValue(code);
  //jquery the lesson text.
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

function setUnit(unitID) {
  localStorage.setItem("unit", unitID);
}

function getUnit() {
  return localStorage.getItem("unit");
}