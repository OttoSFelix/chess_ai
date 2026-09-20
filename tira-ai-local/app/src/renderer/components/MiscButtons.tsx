import { killProcess } from "./../MoveSender";

/**
 * Represents miscellaneous buttons for the game interface such as the Copy PGN button, Copy FEN button and Kill process button
 *
 * @param {object} props - Component props
 * @param {string} props.selectedGame - Selected game
 * @param {number} props.boardIndex - Index of the current board state
 * @param {Function} props.createFen - Function to create FEN notation
 * @param {Function} props.exportPgn - Function to export PGN format
 * @param {Function} props.createNotification - Function to create notifications
 * @param {Function} props.setHasBeenSubmitted - Function to set hasBeenSubmitted flag
 *
 * @returns {JSX.Element} - React component representing the miscellaneous buttons
 */
export function MiscButtons(props: {
	selectedGame: string;
	boardIndex: number;
	createFen(index: number): string;
	exportPgn(): void;
	createNotification(header: string, body: string, bg: string): void;
	setHasBeenSubmitted(arg0: boolean): void;
	handleResetBoard?(): void;
}) {
	function copyFenToClipboard() {
		const fen = props.createFen(props.boardIndex);
		navigator.clipboard
			.writeText(fen)
			.then(() => {
				props.createNotification("Copied FEN to clipboard!", fen, "");
			})
			.catch((err) => {
				props.createNotification(
					"Error copying FEN notation to clipboard",
					err,
					"danger",
				);
			});
	}

	function killGameProcess() {
		props.setHasBeenSubmitted(false);
		killProcess();
	}

	return (
		<div id="misc-buttons">
			{props.selectedGame === "chess" && (
				<>
					<button
						className="classic-button"
						onClick={copyFenToClipboard}
						title="Copy the current position in FEN format to clipboard"
					>
						Copy current FEN
					</button>
					<button
						className="classic-button"
						onClick={props.exportPgn}
						title="Copy the game in PGN format to clipboard"
					>
						Copy current PGN
					</button>
					{props.handleResetBoard && (
						<button
							className="classic-button"
							onClick={props.handleResetBoard}
							title="Reset the board and chess clock"
						>
							Reset Board
						</button>
					)}
				</>
			)}
			<button
				className="classic-button"
				onClick={killGameProcess}
				title="Kill the active AI process"
			>
				Kill Process
			</button>
		</div>
	);
}
