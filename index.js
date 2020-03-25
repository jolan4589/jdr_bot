fs = require('fs')

const lgpath = './srcs/lg.json'

const Discord = require('discord.js')
const texts = require("./srcs/texts.json")
const lg = require(lgpath)

const bot = new Discord.Client()
const bot_id = 691665384453177385

const pre = '%'
const reg = /test/
const regId = RegExp('(^<)(@.*)(>$)')

const botlogin = require('./botlogin.json').login
/**
 * function :
 * 	this function return an int between 1 and max include
 * @param {int} max 
 */
function getRandomInt(max) {
	return Math.floor(1 + Math.random() * Math.floor(max));
}

function errorMessage(str) {
	chan.send(str)
	console.log(str)
	return
}

//	DICE FUNCTIONS

/**
 * function :
 *	this function retun a str of n random, in range max, numbers.	
 * @param {int} n 
 * @param {int} max 
 */
function nDiceN(n, max) {
	i = 0;
	tmp = getRandomInt(max)
	while (++i < n)
	{
		tmp += ' | '
		tmp += getRandomInt(max)
	}
	return (tmp)
}

//	LG FUNCTIONS

/**
 * Process :
 * 	This process save actual lg informations in lgjson file.
 */
function lg_save() {
	fs.writeFile(lgpath, JSON.stringify(lg), err => {
		if (err) errorMessage('Error writting in' + lgpath)
		else console.log('Success wrote in' + lgpath)
	})
}

/**
 * Process :
 * 	This process close current game.
 * TODO: ajouter un affichage avec reactions pour demander de cloturer ou non la game en cours
 */
function lg_end() {
	if (lg.game == 0) errorMessage('Aucune partie n\'est en cours o.0')
	else {
		lg.game = 0
		lg_save()
		errorMessage('Partie cloturée, merci d\'avoir jouer')
	}
}

/**
 * Process :
 * 	This process print jsons file informations error and start the game.
 * @param {int} n 
 */
function lg_startgame(n) {
	if (lg.game != 0) errorMessage("Une partie est déjà en cours, cloturez là via %lgend avant d'en commencer une autre")
	else if (lg.players.length == 0) errorMessage("Veuillez remplir la liste de joueurs via %lgp, %lgpadd ou %lgpdel (%lgp? pour voir la liste)")
	else if (lg.cards1.length != lg.players.length && n == 2 ? lg.cards2.length : 1) errorMessage("Veuillez renseigner autant de cartes que de joueur, dans le(s) set(s) de cartes, via %lgc, %lgcadd ou %lgcdel (%lgc? pour voir la liste)")
	else {
		lg.game = 1
		lg_save()
	}
}

function lg_sendPlayerList() {
	blop = []
	i = -1
	while (lg.players[++i])
	{
		blop[i] = lg.players[i]
		blop[i] = blop[i].substring(3, blop[i].length - 1)
		tmp = blop[i]
		blop[i] = tmp.username
		blop[i].send("yolo")
	}
	return (blop)
	//return (blop = (lg.players.toString()))
}

/**
 * function :
 * 	This function return tab witout duplicate values
 * @param {*} tab 
 */
function removeDuplicates(tab) {
	let unique = {};
	tab.forEach(function(i) {
	  if(!unique[i]) {
		unique[i] = true;
	  }
	});
	return Object.keys(unique);
}

/**
 * Process :
 * 	This process add to Player list, none_already existant players 
 * @param {Array{User}} list 
 */
function lg_addPlayers(list) {
	if (!list || !list[0]) return errorMessage("Aucun utilisateur trouvé")

	lg.players = removeDuplicates(lg.players.concat(list))
	lg_save()
	chan.send("Succes de l'ajout des joueurs. les membres sont maintenant :" + lg_sendPlayerList())
}

/**
 * function :
 * 	this function find and add all player mentionned to player list
 */
function lg_findAddPlayers() {
	val = []
	if ((i = tab.findIndex((str) => RegExp('.*padd').test(str))) == -1) return val
	while (regId.test(tab[++i]))
		val.push(tab[i])
	return val
}

function lg_findPlayers() {
	val = []
	if ((i = tab.findIndex((str) => RegExp('.*pset').test(str))) == -1) return errorMessage("Aucun joueur trouvé.")
	while (regId.test(tab[++i]))
		val.push(tab[i])
	lg.players = val
	lg_save()
	chan.send("la liste des joueurs à bien été écrasée. les membres sont maintenant :" + lg_sendPlayerList())	
}

bot.on('ready', () => {
	console.log(`Logged in as ${bot.user.tag}!`)
})

bot.on('message', msg => {
	chan = msg.channel
	txt = msg.content
	tab = txt.split(RegExp(' {1,}'))
	/** ping request for testing bot **/
	if (RegExp("^" + pre + 'ping$', 'i').test(txt) && msg.author != bot_id) {
		chan.send('Pong!')
	}

	/** Start a lg game */
	else if (RegExp("^" + pre + 'lg', 'i').test(txt) && msg.author != bot_id) {
		if (RegExp('pset', 'i').test(txt)) lg_findPlayers()
		if (RegExp('padd', 'i').test(txt)) lg_addPlayers(lg_findAddPlayers())
		if (RegExp('p\?', 'i').test(txt)) chan.send(lg_sendPlayerList())
		if (RegExp('lg?$', 'i').test(txt)) {
			if (txt[3] === '2') lg_startgame(2)
			else lg_startgame(1)
		}
		if (RegExp('end$', 'i').test(txt)) lg_end()
	}
	/** help TODO : everything **/
	else if (RegExp("^" + pre + 'help$', 'i').test(txt) && msg.author != bot_id) {
		chan.send({embed:texts[0]})
	}
	/** Dice request TODO : affichage?**/
	else if (RegExp("^" + pre + '\\d{1,3}d\\d{1,3}$', 'i').test(txt) && msg.author != bot_id) {
		words = txt.split('d')
		chan.send(nDiceN(words[0].substring(words[0].search(/\d/)) > 100 ? 100 : words[0].substring(words[0].search(/\d/)), words[1]))
	}
	/** Useless hidden nfs request /*/
	else if (RegExp("^" + pre + 'sfw?$', 'i').test(txt) && msg.author != bot_id) {
		chan.nsfw ? chan.send('QUIT THIS CHANNEL RIGHT NOW!') : chan.send('Ce chanel est safe pour travailler.')
	}
	else if (reg.test(txt) && msg.author != bot_id) {
		//msg.author.send("MDR")
		//console.log(txt)
		z = 0
		man = []
		mention = msg.mentions.users.forEach(function(i) {
			man[z] = i
			z++;
		})
		chan.send(man)
		jsonString = JSON.stringify(man)
		fs.writeFile('path', jsonString, err => {
			if (err) {
				console.log('Error writing file', err)
			} else {
				console.log('Successfully wrote file')
			}
		}) 
	}
})

bot.login(botlogin)

/** TEMPLATES */
	// lg
	/*
	{
		"game": {0 game down} {1 in game},
		"nbCards" : x define number of lists used during the game
		"players":[list of players id for send mp and mention],
		"playerCards1":[list of cards 1 of each players],
		"playerCards2":[same but for cards 2],
		"cards1":[list of poul cards 1],
		"cards2":[same for cards 2]
	}
	*/

/** AIDE */

/** Json manipulation */
	/*
	customer = {
		order_count: 0,
		address: "Po Box City",
	}
	jsonString = JSON.stringify(customer)
	fs.writeFile('path', jsonString, err => {
		if (err) {
			console.log('Error writing file', err)
		} else {
			console.log('Successfully wrote file')
		}
	}) 
	*/