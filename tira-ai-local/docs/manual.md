# Tira AI platform local version - Manual

## Downloading the executable

- Download the latest release from Github
- Unzip the zip file
- Run the exe file

## Configuring your AI

- The configuration should be done like in the [Stupid Chess AI](https://github.com/game-ai-platform-team/stupid-chess-ai/) project
- In the [Tiraconfig](https://github.com/game-ai-platform-team/stupid-chess-ai/tree/main/tiraconfig) folder you add the shell scripts to setup your AI project
- In the runcommand file you write the command to run your project.
- In the example project, the code is written inside [Stupid_ai.py](https://github.com/game-ai-platform-team/stupid-chess-ai/blob/main/src/stupid_ai.py), but you can use any file anywhere inside the repository.
- The AI waits for commands using four tags `PLAY: , MOVE: , BOARD: , RESET: `
  - The AI needs the `PLAY:` tag to make its own move
  - The moves are printed as `MOVE:`+ the move in the [the UCI format](https://en.wikipedia.org/wiki/Universal_Chess_Interface)
  - The `BOARD:` tag takes a string of [FEN notation](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation) to set up a board
  - The `RESET:` tag allows you to reset the board to its default position

## Playing against your AI

- When you have the exe opened give the path to your AI folder, for example: /home/user/stupid-chess-ai
- Press the submit button
- Play the first move in the UI chessboard and if your AI is configured correctly it will play the next move
- In the UI you are able to give a FEN notation string to start a game from a specific board position. More info about FEN notation [here](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation)
- For example: `rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2` would be a valid FEN notation
- The `w` or `b` in the FEN notation let you choose to play as the white or the black pieces against your bot
- `Copy current FEN` button allows you to copy the current UI board position in the FEN format
- Re-submitting using the `Submit` button works as resetting the board
