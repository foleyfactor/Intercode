function generateUnit(activeThemes) {
	var r = Math.floor(Math.random() * activeThemes.length);
	return activeThemes[r];
}

function generateWord(theme) {
	var r = Math.floor(Math.random() * theme.length);
	return theme[r];
}

function objectToList(obj) {
	var x = [];
	for (var key in obj) {
		x.push(obj[key]);
	}
	return x;
}