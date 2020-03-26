fs = require('fs')

const Jdr = require('./srcs/js/jdr.js')
const Lg = require('./srcs/js/lg.js')

const lgpath = './srcs/json/lg.json'

const Discord = require('discord.js')
const texts = require("./srcs/json/texts.json")
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
	tab = txt.split(RegExp(' {1,}'))
	z = 0
	mentions = []
	msg.mentions.users.forEach(function(i) {
		mentions[z] = i
		z++;
	})
	/** ping request for testing bot **/
	if (RegExp("^" + pre + 'ping$', 'i').test(txt) && msg.author != bot_id) {
		chan.send('Pong!')
	}

	/** Start a lg game */
	else if (RegExp("^" + pre + 'lg', 'i').test(txt) && msg.author != bot_id) {
		if (RegExp('pclear', 'i').test(txt)) Lg.clearPlayers()
		if (RegExp('pset', 'i').test(txt)) Lg.setPlayers()
		if (RegExp('padd', 'i').test(txt)) Lg.addPlayers()
		if (RegExp('plist', 'i').test(txt)) chan.send("Liste des joueurs : " + Lg.sendPlayerList())
		if (RegExp('lg.?$', 'i').test(txt)) {
			if (tab[tab.length - 1].length - 1 == '2') Lg.startGame(2)
			else Lg.startGame(1)
		}
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
	else if (RegExp("^" + pre + 'sfw?$', 'i').test(txt) && msg.author != bot_id) {
		chan.nsfw ? chan.send('QUIT THIS CHANNEL RIGHT NOW!') : chan.send('Ce chanel est safe pour travailler.')
	}
	else if (reg.test(txt) && msg.author != bot_id) {

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