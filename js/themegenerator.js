function generateUnit(activeThemes) {
	var r = Math.floor(Math.random() * activeThemes.length);
	var i = 0;
	for (key in activeThemes) {
		if (i == r) {
			return key;
		}
		i++;
	}
}

function generateWord(theme) {
	var r = Math.floor(Math.random() * theme.length);
	return theme[r];
}