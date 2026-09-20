import { AbstractNode, Game, Position, pgnWrite } from "kokopu";

/**
 * Creates a PGN string from the given moves and game metadata.
 *
 * @param {string[]} moves - Array of moves in UCI format
 * @param {string} startingFen - Starting FEN notation of the game position (optional)
 * @param {number} fullMoves - Number of full moves completed in the game (optional)
 * @param {string} whiteName - Name of the white player (optional)
 * @param {string} blackName - Name of the black player (optional)
 * @param {number} whiteElo - Elo rating of the white player (optional)
 * @param {number} blackElo - Elo rating of the black player (optional)
 * @returns {string} - PGN string representing the game
 */
export function createPGNString(
	moves: string[],
	startingFen?: string,
	fullMoves?: number,
	whiteName?: string,
	blackName?: string,
	whiteElo?: number,
	blackElo?: number,
) {
	const game = new Game();
	game.date(new Date());
	game.site("tira-ai-local");
	game.playerName("w", whiteName);
	game.playerName("b", blackName);
	game.playerElo("w", whiteElo);
	game.playerElo("b", blackElo);

	const position = new Position(
		startingFen === undefined ? "start" : startingFen,
	);

	game.initialPosition(position, fullMoves === undefined ? 0 : fullMoves);

	let current: AbstractNode = game.mainVariation();
	for (let i = 0; i < moves.length; i++) {
		const move = moves[i];
		const move_san = position.notation(position.uci(move));
		position.play(move_san);
		current = current.play(move_san.toString());
	}

	const text = pgnWrite(game);

	return text;
}
