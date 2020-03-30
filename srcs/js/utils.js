const Utils = require('./utils.js')
const lg = require('../json/lg.json')

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

/**
 * Function :
 *  My personnal str spliter.
 * @param {string} str 
 */
exports.splitInput = function(str) {
    tmp = [""]
    split = true
    i = -1
    j = 0
    while (str[++i]) {
        if (str[i] == '"') {
            if (split && tmp[j] != "") {
                j++
                tmp[j] = ""
            }
            split = !split
        }
        if (str[i] == ' ' && tmp[j] != "" && split && tmp[j] != "") {
            j++
            tmp[j] = ""
        }
        if (!split || (str[i] != ' ' && split)) tmp[j] = tmp[j].concat(str[i])
        if (str[i] == '"' && split && tmp[j] != "") {
            j++
            tmp[j] = ""
        }
    }
    return (tmp)
}

/**
 * Fucntion :
 *  This function return a random value from list and delet it.
 * @param {array} list 
 */
exports.pickRandom = function(list) {
    w = Utils.getRandomInt(list.length) - 1
    t = list[w]
    list.splice(w, 1)
    return {"elem":t, "list":list}
}

exports.verifLists = function(n) {
    return (lg.players.length == lg.cards1.length && n == 2 ? lg.cards2.length == lg.players.length : true)
}