const regId = RegExp('(^<)(@.*)(>$)', 'i')
const regCard = RegExp('(^"....*"$)')
const lgPath = '../json/lg.json'
const rootLgPath = './srcs/json/lg.json'

const lg = require(lgPath)
const Discord = require('discord.js')
const Utils = require('./utils.js')
const Ind = require('../../index.js')

/**
 * Process :
 * 	This process save actual lg informations in lgjson file.
 */
function save() {
	test = true
	lg.players = Utils.removeDuplicates(lg.players)
	fs.writeFile(rootLgPath, JSON.stringify(lg), err => {
		if (err) {
			Utils.errorMessage('Error writting in' + rootLgPath)
			test = false
		}
		else {
			console.log('Success wrote in' + rootLgPath)
		}
	})
	return (test)
}

/**
 * Process :
 * 	This process close current game.
 * TODO: ajouter un affichage avec reactions pour demander de cloturer ou non la game en cours
 */
function endGame() {
	if (!lg.game) Utils.errorMessage('Aucune partie n\'est en cours o.0')
	else {
		lg.game = false
		if (save()) chan.send('Partie cloturée, merci d\'avoir jouer')
	}
}

/**
 * Process :
 * 	This process print jsons file informations error and start the game.
 * @param {int} n 
 */
function startGame(n) {
	if (lg.game) Utils.errorMessage("Une partie est déjà en cours, cloturez là via %lgend avant d'en commencer une autre.")
	else lg.game = true
	if (!lg.players.length) Utils.errorMessage("Veuillez remplir la liste de joueurs via %lgp, %lgpadd ou %lgpdel. (%lgplist pour voir la liste)"), lg.game = false
	if (lg.cards1.length != lg.players.length) Utils.errorMessage("Ils n'y a pas autant de cartes dans la liste 1 que le nombre de joueurs. Utiliser %lgcadd1, %lgcset1 pour y remédier. (%lgclist1 pour voir la liste)"), lg.game = false
	if (n == 2 && lg.cards2.length != lg.players.length) Utils.errorMessage("Ils n'y a pas autant de cartes dans la liste 2 que le nombre de joueurs. Utiliser %lgcadd2, %lgcset2 pour y remédier. (%lgclist1 pour voir la liste)"), lg.game = false
	if (lg.game) {
		attributePlayersCard(n)
		sendPlayerRole(n)		
		lg.night = true
		if (save()) chan.send("La partie commence!")
	}
}

/**
 * Process :
 * 	This process clear selected lg tab.
 * @param {String} wichOne
 */
function clearList(wichOne) {
	if (wichOne == 'p') {
		lg.players = []
	}
	else if (wichOne == 'c1') {
		lg.cards1 = []
	}
	else if (wichOne == 'c2') {
		lg.cards2 = []
	}
	if (save()) {
		chan.send("Liste correctement effacée.")
	}
	console.log(lg.cards1)
}


/** Players part */

/**
 * Process :
 * 	This process send to each players his own role.
 * @param {int} n
 */
function sendPlayerRole(n) {
	z = -1
	while (lg.players[++z]) {
		buf = new Discord.User(Ind.bot, lg.players[z])	
		buf.send("Tu est : " + lg.playersCard1[z])
		if (n == 2) buf.send("Et : " + lg.playersCard2[z])
	}
}

/**
 * Process :
 * 	This process attribute one card to each player
 * @param {int} n
 */
function attributePlayersCard(n) {
	temp = lg.cards1.slice()
	lg.playersCard1 = []
	while (temp.length) {
		tmp = Utils.pickRandom(temp)
		temp = tmp.list
		lg.playersCard1 = lg.playersCard1.concat(tmp.elem)
	}
	if (n == 2) {
		temp = lg.cards2.slice()
		lg.playersCard2 = []
		while (temp.length) {
			tmp = Utils.pickRandom(temp)
			temp = tmp.list
			lg.playersCard2 = lg.playersCard2.concat(tmp.elem)
		}
	}
	save()
}

/**
 * Function :
 *  This function take an id as param and return conspondant User.
 * @param {str} player  : id
 */
function findPlayer(player) {
	w = 0
	finded = false

	player = player.substring(3, player.length - 1)
	mentions.forEach(function(z) {
		if (z.id == player) {
			finded = true
		}
		if (!finded) w++
	})
	return finded ? mentions[w] : Utils.errorMessage("Le joueur n'a pas été trouvé")
}

/**
 * Function :
 *  This function return Player username list
 * TODO : return pseudo?
 */
function sendPlayerList() {
	blop = []
	i = -1
	while (lg.players[++i])
	{
		blop[i] = ' ' + lg.players[i].username
	}
	return (blop.toString())
}

/**
 * Process :
 * 	This process add to Player list, none_already existant players.
 * @param {Array{User}} list 
 */
function addPlayers() {
	val = []
	if ((i = tab.findIndex((str) => RegExp('.*padd', 'i').test(str))) == -1) return Utils.errorMessage("Aucun joueur trouvé.")
	while (regId.test(tab[++i])) {
		val.push(findPlayer(tab[i]))
	}
	if (!val || !val[0]) return Utils.errorMessage('Aucun utilisateur trouvé')
	lg.players = lg.players.concat(val)
	if (save()) chan.send("Succes de l'ajout des joueurs. Les membres sont maintenant " + lg.players.length + " : " + sendPlayerList())
}

/**
 * Process :
 *  This process set players list.
 */
function setPlayers() {
	val = []
	if ((i = tab.findIndex((str) => RegExp('.*pset', 'i').test(str))) == -1) return Utils.errorMessage("Aucun joueur trouvé.")
	while (regId.test(tab[++i])) {
		val.push(findPlayer(tab[i]))
	}
	if (!val || !val[0]) return Utils.errorMessage('Aucun utilisateur trouvé')
	lg.players = val
	if (save()) chan.send("L'affectation s'est correctement déroulée. Les membres sont maintenant " + lg.players.length + " : " + sendPlayerList())
}


/** Cards part */

/**
 * Process :
 *	This process set selected cards list
 * @param {String} wichOne 
 */
function setCards(wichOne) {
	val = []
	if ((i = tab.findIndex((str) => RegExp('.*cset' + wichOne, 'i').test(str))) == -1) return Utils.errorMessage("Aucune carte n'a été trouvée")
	while (regCard.test(tab[++i])) {
		val.push((tab[i].substring(0, tab[i].length)))
	}
	if (!val || !val[0]) return Utils.errorMessage('Aucune carte n\'a été trouvée')
	if (wichOne == 2) lg.cards2 = val
	else lg.cards1 = val
	if (save()) chan.send("L'affectation s'est correctement déroulée. Les cartes" + wichOne + " sont maintenant : " + val.join(', '))
}

/**
 * 
 * @param {int} n 
 */
function addCards(wichOne) {
	val = []
	if ((i = tab.findIndex((str) => RegExp('.*cadd' + wichOne, 'i').test(str))) == -1) return Utils.errorMessage("Aucune carte n'a été trouvée")
	while (regCard.test(tab[++i])) {
		val.push((tab[i].substring(0, tab[i].length)))
	}
	if (!val || !val[0]) return Utils.errorMessage('Aucune carte n\'a été trouvée')
	if (wichOne == 2) lg.cards2 = lg.cards2.concat(val)
	else lg.cards1 = lg.cards1.concat(val)
	if (save()) chan.send("Succes de l'ajout des cartes. Les cartes sont maintenant " + (wichOne == 2 ? lg.cards2.length : lg.cards1.length) + " : " + (wichOne == 2 ? lg.cards2.join(",") : lg.cards1.join(",")))
}

function sendListToMj(n) {
	i = -1
	while (lg.players[++i]) {
		chan.send("" + lg.players[i].username + " -> " + lg.cards1[i] + '; ' + (n == 2 ? lg.cards2[i] : "none"))
	}
}

exports.endGame = endGame
exports.startGame = startGame
exports.sendPlayerList = sendPlayerList
exports.addPlayers = addPlayers
exports.setPlayers = setPlayers
exports.clearList = clearList
exports.setCards = setCards
exports.sendPlayerRole = sendPlayerRole
exports.addCards = addCards
exports.attributePlayersCard = attributePlayersCard
exports.sendListToMj = sendListToMj