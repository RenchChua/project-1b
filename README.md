# project-1b

About the Game:

Reversi is a strategy board game for two players, played on an 8×8 uncheckered board. There are sixty-four identical game pieces called disks (often spelled "discs"), which are light on one side and dark on the other. Players take turns placing disks on the board with their assigned color facing up. During a play, any disks of the opponent's color that are in a straight line and bounded by the disk just placed and another disk of the current player's color are turned over to the current player's color.

The game ends when neither players have any valid moves left. The object of the game is to have the majority of disks turned to display your color when the last playable empty square is filled.

The version I have also allows players to restart at any time.

When a player hovers over a position that is playable, a minified version of the player's piece appears to indicate that that position is a playable position. It also shows all the opponent's pieces that will be flipped if the player places there. 

Advice from others:

Angeline advised me to have code to ensure that the piece that I'm checking to see if it should be flipped is within the board. Based on that advice, I wrote a isOnBoard function. 

Improvements to code:

The game display isn't responsive at the moment and the aesthetic is quite bare. I tried to use OOP, but wasn't able to do it entirely. 

My code is quite messy at the moment, with functions declared at the weird places.  Some parts could possibly be made DRYer. 
