/**
 * Function :
 * 	This function return an int between 1 and max include.
 * @param {int} max 
 */
exports.getRandomInt = function(max) {
	return Math.floor(1 + Math.random() * Math.floor(max));
}

/**
 * Process :
 *  This process send in channel and console definded message.
 * @param {String} str 
 */
exports.errorMessage = function(str) {
	chan.send(str)
	console.log(str)
	return
}

/**
 * function :
 * 	This function return tab witout duplicate values
 * @param {*} tab 
 */
exports.removeDuplicates = function(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}