function generateUnit(activeThemes) {
	var r = Math.floor(Math.random() * activeThemes.length);
	return activeThemes[r];
}

function generateArray(theme) {
	return shuffle(theme);
}

function objectToList(obj) {
	var x = [];
	for (var key in obj) {
		x.push(obj[key]);
	}
	return x;
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}