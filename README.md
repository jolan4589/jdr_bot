### Code by Riallot Jolan v 0.2.1

#   Role play game bot for discord.

### Add root file : botlogin.json and fill it with : {"login" : "YourBotLogin"}

##  Implemented :

- %help -> Bot help.
- %ping -> For test bot, he should send "Pong!".
- %ndx -> Roll n dice in range 1 to x included.

"loup garou" Special command (prefix "%lg")
- start|| startn-> Lunch the game (1 and 2 cards implemented, other do same as 1). Need be last command.
- end 		-> End current party. Need be last command.
- padd		-> Add following player players, work with @mention.
- pset		-> Erase corrent list and replace it be following players, work with @mention.
- plist		-> Show actual player list.
- pclear	-> Reset current player list.
- pattn		-> Attribute n cards to each player and send him his role.s. 
- cclearn	-> Clear cards list n.
- csetn		-> Set cards list n.
- caddn		-> Add cards to cards list n.
- clistn	-> Show cards list n.


TODO : trouver un moyen de réucpérer l'objet user a partir d'une mention de ce dernier. Pour pouvoir le mp plus tard et tout.