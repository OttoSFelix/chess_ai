import { Chessboard } from "kokopu-react";
import { MoveDescriptor, Position } from "kokopu";
import {
	sendMove,
	setReturnMove,
	sethandleMovePlayedByAi,
} from "../../MoveSender";
import { getData } from "../../UserData";

/**
 * Represents the Chess game board UI component.
 *
 * @param {object} props - Component props
 * @param {Position} props.pos - Current position of the chessboard
 * @param {Function} props.addPosition - Function to add a position to the game
 * @param {boolean} props.active - Flag indicating if the UI is active
 * @param {Function} props.notification - Function to display notifications
 * @param {string} props.arrow - String representing the arrow marker on the board
 *
 * @returns {JSX.Element} - React component representing the Chess game board UI
 */
export function MyChessboard(props: {
	pos: Position;
	addPosition: (position, move) => void;
	active: boolean;
	notification?(header, body, bg?): void;
	arrow: string;
}) {
	function handleMovePlayed(move: string) {
		if (props.active) {
			const copy = new Position(props.pos);
			const move_desc = copy.notation(move);

			props.addPosition(copy, move_desc);
			if (checkGameOver(move)) {
				// Don't request new move if game is over
				setReturnMove(false);
			}
			sendMove(copy.uci(move_desc));
			copy.play(move_desc);
		} else {
			props.notification?.(
				"AI Process Inactive",
				"The AI process must be active to interact with the game board. Input the path and press SUBMIT.",
			);
		}
	}

	function handleMovePlayedByAi(move: string) {
		if (props.active) {
			if (validateMove(move)) {
				const copy = new Position(props.pos);
				const move_desc = copy.uci(move);

				copy.play(move_desc);
				props.addPosition(copy, move_desc);
			} else {
				props.notification?.(
					"Move was not played!",
					`${move} is not a valid uci move to play in position: ${props.pos.fen()}.`,
					"Danger",
				);
			}
		} else {
			props.notification?.(
				"Move was not played!",
				"Board is not active.",
				"danger",
			);
		}
	}

	function validateMove(move: string) {
		const copy = new Position(props.pos);
		let move_desc: MoveDescriptor;
		try {
			move_desc = copy.uci(move);
		} catch (error) {
			return false;
		}
		const move_san = copy.notation(move_desc);
		const success = copy.play(move_san);
		return success;
	}

	function checkGameOver(move) {
		const copy = new Position(props.pos);
		copy.play(copy.notation(move));
		return copy.isCheckmate() || copy.isDead() || copy.isStalemate();
	}

	sethandleMovePlayedByAi(handleMovePlayedByAi);

	return (
		<div>
			<Chessboard
				interactionMode={"playMoves"}
				onMovePlayed={(move) => handleMovePlayed(move)}
				position={props.pos}
				arrowMarkers={props.arrow}
				squareSize={60}
				colorset={getData("color_set")}
				pieceset={getData("piece_set")}
			/>
		</div>
	);
}
