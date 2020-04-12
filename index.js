fs = require('fs')

const Jdr = require('./srcs/js/jdr.js')
const Lg = require('./srcs/js/lg.js')
const Utils = require('./srcs/js/utils.js')
const Zeub = require('./srcs/js/zeub.js')
const lgpath = './srcs/json/lg.json'

const Discord = require('discord.js')
const texts = require("./srcs/json/texts.json")
const zeub = require('./srcs/json/zeub.json')
const lg = require(lgpath)

const bot = new Discord.Client()
const bot_id = 691665384453177385

const pre = '%'
const reg = /test/

const botlogin = require('./botlogin.json').login

bot.on('ready', () => {
	console.log(`Logged in as ${bot.user.tag}!`)
})

bot.on('message', msg => {
	chan = msg.channel
	txt = msg.content
	tab = Utils.splitInput(txt)
	z = 0
	mentions = []
	msg.mentions.users.forEach(function(i) {
		mentions[z] = i
		z++;
	})
	/** Ping request for testing bot **/
	if (RegExp("^" + pre + 'ping$', 'i').test(txt) && msg.author != bot_id) {
		chan.send('Pong!')
	}

	/**	Lg part */
	else if (RegExp("^" + pre + 'lg', 'i').test(txt) && msg.author != bot_id) {
		/** Player part */
		// Clear lg player list.
		if (RegExp('pclear', 'i').test(txt)) Lg.clearList('p')
		// Set player list.
		if (RegExp('pset', 'i').test(txt)) Lg.setPlayers()
		// Add player to player list.
		if (RegExp('padd', 'i').test(txt)) Lg.addPlayers()
		// Print player list.
		if (RegExp('plist', 'i').test(txt)) chan.send("Les jouers sont " + lg.players.length + " : " + Lg.sendPlayerList())
		// attribute players role
		if (RegExp('patt.?$', 'i').test(txt) && Utils.verifLists(tab[tab.length - 1][tab[tab.length - 1].length - 1] == '2' ? 2 : 1)) Lg.attributePlayersCard(tab[tab.length - 1][tab[tab.length - 1].length - 1] == '2' ? 2 : 1), Lg.sendPlayerRole(tab[tab.length - 1][tab[tab.length - 1].length - 1] == '2' ? 2 : 1)

		/** Card part */
		// Clear card list.
		if (RegExp('cclear1', 'i').test(txt)) Lg.clearList('c1')
		if (RegExp('cclear2', 'i').test(txt)) Lg.clearList('c2')
		if (RegExp('cset1', 'i').test(txt)) Lg.setCards(1)
		if (RegExp('cset2', 'i').test(txt)) Lg.setCards(2)
		if (RegExp('cadd1', 'i').test(txt)) Lg.addCards(1)
		if (RegExp('cadd2', 'i').test(txt)) Lg.addCards(2)
		if (RegExp('clist1', 'i').test(txt)) chan.send("Total de " + lg.cards1.length + " cartes dans la liste 1 : " + lg.cards1.join(', '))
		if (RegExp('clist2', 'i').test(txt)) chan.send("Total de " + lg.cards2.length + " cartes dans la liste 2 : " + lg.cards2.join(', '))
		if (RegExp('mjpcards.?$', 'i').test(txt)) chan.send(Lg.sendListToMj(tab[tab.length - 1][tab[tab.length - 1].length - 1] == '2' ? 2 : 1))
		if (RegExp('plifeset[12]', 'i').test(txt)) {
			temp = tab.find(element => RegExp('plifeset[12]', 'i').test(element))
			Lg.setLife(temp[temp.length - 1])
		}
		if (RegExp('kill', 'i').test(txt)) Lg.killPlayer(tab[tab.findIndex(elem => RegExp('kill', 'i').test(elem)) + 1])
		if (RegExp('vote$', 'i').test(txt)) {
			temp = Lg.voteTxt()
			chan.send(temp.text)
				.then(message => {
					//temp = Lg.voteTxt()
					i = -1
					while (temp.emots[++i]) {
						message.react(temp.emots[i])
							//.catch(Utils.errorMessage("Erreur ajout emoticone"))
					}
				})
				//.catch(Utils.errorMessage("Erreur envois message"))
		}
		// Start lg game.
		if (RegExp('start.?$', 'i').test(txt)) {
			if (tab[tab.length - 1][tab[tab.length - 1].length - 1] == '2') Lg.startGame(2)
			else Lg.startGame(1)
		}
		// End lg game.
		if (RegExp('end$', 'i').test(txt)) Lg.endGame()
	}
	/** help TODO : everything **/
	else if (RegExp("^" + pre + 'help$', 'i').test(txt) && msg.author != bot_id) {
		chan.send({embed:texts[0]})
	}
	/** Dice request TODO : affichage?**/
	else if (RegExp("^" + pre + '\\d{1,3}d\\d{1,3}$', 'i').test(txt) && msg.author != bot_id) {
		words = txt.split('d')
		chan.send(Jdr.nDiceN(words[0].substring(words[0].search(/\d/)) > 100 ? 100 : words[0].substring(words[0].search(/\d/)), words[1]))
	}
	/** Useless hidden nfs request /*/
	else if (RegExp("^" + pre + 'sfw\?', 'i').test(txt) && msg.author != bot_id) {
		chan.nsfw ? chan.send('QUIT THIS CHANNEL RIGHT NOW!') : chan.send('Ce chanel est safe pour travailler.')
	}
	else if (RegExp('%pp').test(txt)) chan.send(msg.author.displayAvatarURL())
	else if (reg.test(txt) && msg.author != bot_id) {
		/*temp = []
		msg.guild.members.forEach(elem => temp.push(msg.guild.member(elem)))
		temp = msg.guild.members.cache[0]
		temp[0].send("oui")
		temp = temp.find(elem => elem.userID == 227765280858701824)
		temp.send("OUI")
		console.log(temp)
		jsonString = JSON.stringify(temp)
		fs.writeFile('path.json', jsonString, err => {
			if (err) {
				console.log('Error writing file', err)
			} else {
				console.log('Successfully wrote file')
			}
		})*/
		emb = {embed:texts[0]}
		//console.log(Zeub.personnageDisp(0))
		//chan.send(Zeub.personnageDisp(0))
		//chan.send(Zeub.personnageDisp(1))
		//chan.send(Zeub.personnageDisp(2))
	}
})

bot.login(botlogin)

exports.bot = bot

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
	// Zeub
	{
		"nom": "",
		"taille": 0,
		"poids": 0,
		"sexe": "MF",
		"age": 0,
		"statistiques": {
			"force": 0,
			"dexterite": 0,
			"intelligence": 0,
			"vitalite": 0
		},
		"bonus": [
			"",
			""
		],
		"malus": [
		],
		"inventaire": [

		],
		"description": "",
		"objectif": [""]
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