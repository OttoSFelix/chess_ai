import { MyConnectFour } from "./MyConnectFour";
import checkForWin from "./CFourWinChecker";
import CFourParser from "./CFourParser";
import {
	sendMove,
	setReturnMove,
	sethandleMovePlayedByAi,
} from "../../MoveSender";

/**
 * This is the view for the Connect Four game.
 * It renders the game board and handles moves played by both players
 * and AI. It also checks for win conditions and notifies the players
 * when the game is over.
 *
 * @param {object} props - Component props
 * @param {Function} props.setMoves - Function to set the moves array
 * @param {boolean} props.hasBeenSubmitted - Flag indicating if moves have been submitted
 * @param {number} props.boardIndex - Index of the current move in the moves array
 * @param {Function} props.setBoardIndex - Function to set the board index
 * @param {string[]} props.moves - Array containing the moves played in the game
 * @param {Function} [props.notification] - Function to display notifications
 * @param {Function} props.setHasBeenSubmitted - Function to set the hasBeenSubmitted flag
 * @param {Function} [props.setGameOver] - Function to set the game over flag
 * @param {boolean} [props.gameOver] - Flag indicating if the game is over
 *
 * @returns {JSX.Element} - React component representing the Connect Four game view
 */
export function CFourView(props: {
	setMoves(arg0: string[]): void;
	hasBeenSubmitted: boolean;
	boardIndex: number;
	setBoardIndex(arg0: number): void;
	moves: string[];
	notification?(header, body, bg?): void;
	setHasBeenSubmitted(arg0: boolean): void;
	setGameOver?(arg0: boolean): void;
	gameOver?: boolean;
}) {
	const numberMoves = props.moves.map((value) => Number(value));

	function handleMovePlayedByAi(move: string) {
		if (!isGameOver) {
			if (validateMove(move)) {
				props.setMoves(
					props.moves.slice(0, props.boardIndex).concat(move),
				);
				props.setBoardIndex(props.boardIndex + 1);
			} else {
				props.notification(
					"Move was not played!",
					`${move} cannot be played because the column is full`,
					"danger",
				);
			}
		}
	}

	function handleMovePlayed(move: string) {
		props.setMoves(props.moves.slice(0, props.boardIndex).concat(move));
		props.moves.push(move);
		if (checkForWin(boardmatrix) || props.moves.length >= 42) {
			setReturnMove(false);
		}
		sendMove(move);
		props.setBoardIndex(props.boardIndex + 1);
	}

	function validateMove(move: string): boolean {
		const moveCount = props.moves.reduce((count, m) => {
			return m === move ? count + 1 : count;
		}, 0);

		return moveCount < 6;
	}

	sethandleMovePlayedByAi(handleMovePlayedByAi);

	const boardmatrix = CFourParser({
		moves: numberMoves,
		boardIndex: props.boardIndex,
	});
	const isGameOver = checkForWin(boardmatrix) || props.moves.length >= 42;

	if (isGameOver && !props.gameOver) {
		const moveCount = props.moves.length;
		const winner =
			moveCount >= 42
				? "Tie! No one"
				: moveCount % 2 === 0
					? "Yellow"
					: "Red";
		props.notification("GAME OVER!", `${winner} has won the game!`);
		props.setGameOver(true);
	}

	return (
		<div id="game-view">
			<MyConnectFour
				moves={numberMoves}
				boardIndex={props.boardIndex}
				onMovePlayed={handleMovePlayed}
				active={!isGameOver && props.hasBeenSubmitted}
				notification={props.notification}
			/>
			<div>Turn {props.boardIndex}</div>
		</div>
	);
}
