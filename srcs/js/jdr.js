const Utils = require('./utils.js')

/**
 * function :
 *	this function retun a str of n random, in range max, numbers.	
 * @param {int} n 
 * @param {int} max 
 */
function nDiceN(n, max) {
	i = 0;
	tmp = Utils.getRandomInt(max)
	while (++i < n)
	{
		tmp += ' | '
		tmp += Utils.getRandomInt(max)
	}
	return (tmp)
}

exports.nDiceN = nDiceN
