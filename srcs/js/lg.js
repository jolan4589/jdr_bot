const regId = RegExp('(^<)(@.*)(>$)')
const lgPath = '../json/lg.json'
const rootLgPath = './srcs/json/lg.json'
const lg = require(lgPath)


const Utils = require('./utils.js')

/**
 * Process :
 * 	This process save actual lg informations in lgjson file.
 */
function save() {
	lg.players = Utils.removeDuplicates(lg.players)
	fs.writeFile(rootLgPath, JSON.stringify(lg), err => {
		if (err) Utils.errorMessage('Error writting in' + rootLgPath)
		else console.log('Success wrote in' + rootLgPath)
	})
}

/**
 * Process :
 * 	This process close current game.
 * TODO: ajouter un affichage avec reactions pour demander de cloturer ou non la game en cours
 */
function endGame() {
	if (lg.game == 0) Utils.errorMessage('Aucune partie n\'est en cours o.0')
	else {
		lg.game = 0
		save()
		Utils.errorMessage('Partie cloturée, merci d\'avoir jouer')
	}
}

/**
 * Process :
 * 	This process print jsons file informations error and start the game.
 * @param {int} n 
 */
function startGame(n) {
	if (lg.game != 0) Utils.errorMessage("Une partie est déjà en cours, cloturez là via %lgend avant d'en commencer une autre")
	else if (lg.players.length == 0) Utils.errorMessage("Veuillez remplir la liste de joueurs via %lgp, %lgpadd ou %lgpdel (%lgplist pour voir la liste)")
	else if (lg.cards1.length == lg.players.length && n == 2 ? lg.cards2.length : 1) Utils.errorMessage("Veuillez renseigner autant de cartes que de joueur, dans le(s) set(s) de cartes, via %lgc, %lgcadd ou %lgcdel (%lgc? pour voir la liste)")
	else {
		lg.game = 1
		save()
		Utils.errorMessage("Aucune erreur rencontré dans le lancement de la partie")
	}
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
	if ((i = tab.findIndex((str) => RegExp('.*padd').test(str))) == -1) return Utils.errorMessage("Aucun joueur trouvé.")
	while (regId.test(tab[++i])) {
		val.push(findPlayer(tab[i]))
	}
	if (!val || !val[0]) return Utils.errorMessage('Aucun utilisateur trouvé')
	lg.players = lg.players.concat(val)
	save()
	chan.send("Succes de l'ajout des joueurs. Les membres sont maintenant :" + sendPlayerList())
}

/**
 * Process :
 *  This process set players list.
 */
function setPlayers() {
	val = []
	if ((i = tab.findIndex((str) => RegExp('.*pset').test(str))) == -1) return Utils.errorMessage("Aucun joueur trouvé.")
	while (regId.test(tab[++i])) {
		val.push(findPlayer(tab[i]))
	}
	if (!val || !val[0]) return Utils.errorMessage('Aucun utilisateur trouvé')
	lg.players = val
	save()
	chan.send("L'affectation s'est correctement déroulée. Les membres sont maintenant :" + sendPlayerList())
}

/**
 * Process :
 *  This process clear players list.
 */
function clearPlayers() {
	lg.players = []
	save()
	chan.send("Liste des joueurs vidée avec succès")
}


exports.endGame = endGame
exports.startGame = startGame
exports.sendPlayerList = sendPlayerList
exports.addPlayers = addPlayers
exports.setPlayers = setPlayers
exports.clearPlayers = clearPlayers