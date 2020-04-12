const zeub = require('../json/zeub.json')

/**
 * Function :
 * 	Send string of each caracters with his index.
 */
function personnageList() {
    i = -1
    str = ""
    while (zeub.personnages[++i]) {
        str += i
        str += ' ' + zeub.personnages[i].nom + '\n'
    }
    return(str)
}

/**
 * Function :
 * 	This function return stat title for ppls over 100.
 * @param {int} i : stat.
 */
function statLevel(i) {
	if (i > 180) return ('\n**Divin supérieur** ')
	if (i > 150) return ('\n**Divin***')
	if (i > 120) return ('\n**Demi-divin**')
	if (i > 100) return ('\n**Presque divin**')
	return ('')
}

/**
 * Function :
 * 	This return crit range for a stat.
 * @param {int} i : stat. 
 */
function zoneCrit(i) {
	if (i <= 95) return ('')
	return (' *[1<=>' + (5 + i - 95) + ']*')
}

/**
 * Function :
 * 	Return stat string of specified caracarter.
 * @param {int} n : caracter index.
 */
function personnageStrStats(n) {
	stats = zeub.personnages[n].statistiques
	return(
	'- for : ' + stats.force[0] + (stats.force[1] ? ' + ' + stats.force[1] : '') + zoneCrit(stats.force[0] + stats.force[1]) + statLevel(stats.force[0] + stats.force[1]) +
	'\n- dex : ' + stats.dexterite[0] + (stats.dexterite[1] ? ' + ' + stats.dexterite[1] : '') + zoneCrit(stats.dexterite[0] + stats.dexterite[1]) + statLevel(stats.dexterite[0] + stats.dexterite[1]) +
	'\n- int : ' + stats.intelligence[0] + (stats.intelligence[1] ? ' + ' + stats.intelligence[1] : '') + zoneCrit(stats.intelligence[0] + stats.intelligence[1]) + statLevel(stats.intelligence[0] + stats.intelligence[1]) +
	'\n- vit : ' + stats.vitalite[0] + (stats.vitalite[1] ? ' + ' + stats.vitalite[1] : '') + zoneCrit(stats.vitalite[0] + stats.vitalite[1]) + statLevel(stats.vitalite[0] + stats.vitalite[1])
	) 
}

/**
 * Function :
 * 	Return inventory string of specified caracter.
 * @param {int} n : caracter index.
 */
function personnageStrInventaire(n) {
	inventaire = zeub.personnages[n].inventaire
	str = ""
	i = -1
	while (inventaire[++i]) {
		str += "["
		str += inventaire[i][1]
		str += "] : "
		str += inventaire[i][0]
		str += "\n"
	}
	return (str)
}

/**
 * Function :
 * 	Return info string of specified caracter.
 * @param {int} n : caracter index.
 */
function personnageStrInfo(n) {
	perso = zeub.personnages[n]
	return ("- taille : " + perso.taille + "m\n- poids : " + perso.poids + "kg\n- age : " + (perso.age ? perso.age : 0) + "\n- genre : " + perso.sexe)
}

/**
 * Function :
 * 	Return bonus string of specified caracter.
 * @param {int} n : caracter index.
 */
function personnageStrBonus(n) {
	perso = zeub.personnages[n]
	str = ""
	i = -1
	while (perso.bonus[++i]) {
		str += "\n- "
		str += perso.bonus[i]
	}
	if (!i) str = "Aucun bonus."
	return (str)
}

/**
 * Function :
 * 	Return malus string of specified caracter.
 * @param {int} n : caracter index.
 */
function personnageStrMalus(n) {
	perso = zeub.personnages[n]
	str = ""
	i = -1
	while (perso.malus[++i]) {
		str += "\n- "
		str += perso.malus[i]
	}
	if (!i) str = "Aucun malus."
	return (str)
}

/**
 * Function :
 * 	Return embed containing essential information of specified caracter.
 * @param {int} n : caracter index.
 */
function personnageDisp(n) {
	if (!zeub.personnages[n]) return ("Aucun personnage, trouvé")
	let temp = {
		"color": "0xff3df5",
		"title": zeub.personnages[n].nom,
		"author":{
			"name": "Fiche personnage"
		},
		"fields": [
			{
				"name": "**__Description__**",
				"value": zeub.personnages[n].description
			},
			{
				"name": "**__Statistiques__**",
				"value": personnageStrStats(n),
				"inline": true
			},
			{
				"name": "**__Infos__**",
				"value": personnageStrInfo(n),
				"inline": true
			},
			{
				"name": "**__Inventaire__**",
				"value": personnageStrInventaire(n),
			},
			{
				"name": "**__Bonus__**",
				"value": personnageStrBonus(n),
				"inline": true
			},
			{
				"name": "**__Malus__**",
				"value": personnageStrMalus(n),
				"inline": true
			}],
		"image": {
			"url": zeub.personnages[n].image? zeub.personnages[n].image : ""
		},
		"footer": {
			"text": "developpé par Jolan",
			"icon_url": "https://cdn.discordapp.com/avatars/691665384453177385/04abc2348c9b22ef57463bcfbf37d059.webp"
		}
	}
	
	return({embed:temp})
}

exports.personnageList = personnageList
exports.personnageDisp = personnageDisp

