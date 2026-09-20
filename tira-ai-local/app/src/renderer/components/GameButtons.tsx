import { setReturnMove } from "../MoveSender";
import { PlayButton } from "./PlayButton";
/**
 * This is the game control buttons and options component
 *
 * @param {object} props - Component props
 * @param {Function} props.handlePrevMoveButton - Function to handle previous move button click
 * @param {Function} props.handleNextMoveButton - Function to handle next move button click
 * @param {boolean} props.autoSendMove - Flag indicating if auto-send move option is enabled
 * @param {Function} props.handleToggle - Function to handle auto-send move toggle
 * @param {boolean} props.playActive - Flag indicating if play button is active
 * @param {boolean} props.prevActive - Flag indicating if previous move button is active
 * @param {boolean} props.nextActive - Flag indicating if next move button is active
 * @param {boolean} props.hasBeenSumbitted - Flag indicating if moves have been submitted
 * @param {boolean} props.gameOver - Flag indicating if the game is over
 *
 * @returns {JSX.Element} - React component representing the game control buttons and options
 */

export function GameButtons(props: {
	handlePrevMoveButton(): void;
	handleNextMoveButton(): void;
	autoSendMove: boolean;
	handleToggle(): void;
	playActive: boolean;
	prevActive: boolean;
	nextActive: boolean;
	hasBeenSumbitted: boolean;
	gameOver: boolean;
}) {
	setReturnMove(!props.autoSendMove);
	// Set value to checkbox value (if changed elsewhere)
	return (
		<>
			<div className="game-buttons">
				<button
					className="classic-button"
					onClick={props.handlePrevMoveButton}
					data-testid="prev-move-button"
					disabled={!(props.prevActive && props.hasBeenSumbitted)}
				>
					{"<"}
				</button>

				<PlayButton
					active={
						props.playActive &&
						props.hasBeenSumbitted &&
						!props.gameOver
					}
				/>
				<button
					className="classic-button"
					onClick={props.handleNextMoveButton}
					data-testid="next-move-button"
					disabled={
						!(
							props.nextActive &&
							props.hasBeenSumbitted &&
							!props.gameOver
						)
					}
				>
					{">"}
				</button>
			</div>
			<div>
				<label htmlFor="auto-send-toggle">Send PLAY after move</label>
				<input
					type="checkbox"
					id="auto-send-toggle"
					checked={!props.autoSendMove}
					onChange={props.handleToggle}
				/>
			</div>
		</>
	);
}
