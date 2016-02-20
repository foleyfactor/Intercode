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

// output functions are configurable.  This one just appends some text
// to a pre element.
function outf(text) { 
    var mypre = consoleOut.getValue(''); 
    consoleOut.setValue(mypre + text); 
} 
function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
            throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}
// Here's everything you need to run a python program in skulpt
// grab the code from your textarea
// get a reference to your pre element for output
// configure the output function
// call Sk.importMainWithBody()
function runit() { 
   var prog = myCodeMirror.getValue(); 
   var mypre = document.getElementById("youroutput"); 
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
}

function loadLesson(lesson) {
  $('#lesson').text(lesson['lessonText']);
  myCodeMirror.setValue(lesson['input']);

}

function verifyLesson(lesson) {
  var codeOut = consoleOut.getValue();
  var codeIn = myCodeMirror.getValue();
  for (var i=0; i<lesson['outputVerify'].length; i++) {
    var includes = true;
    var check = lesson['outputVerify'][i];
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

  for (var i=0; i<lesson['inputVerify'].length; i++) {
    var includes = true;
    var check = lesson['inputVerify'][i];
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