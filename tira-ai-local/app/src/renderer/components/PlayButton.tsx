import { sendEmpty } from "../MoveSender";

/**
 * Represents a button for the AI to play a move
 *
 * @param {object} props - Component props
 * @param {Function} [props.sendEmpty] - Function to send an empty move
 * @param {boolean} props.active - Flag indicating if the button is active
 *
 * @returns {JSX.Element} - React component representing the play button
 */
export const PlayButton = (props: {
	sendEmpty?: () => void;
	active: boolean;
}) => {
	function sendEmptyMove() {
		if (props.active) {
			if (typeof props.sendEmpty === "undefined") {
				sendEmpty();
			} else {
				props.sendEmpty();
			}
		}
	}

	return (
		<div>
			<button
				className="classic-button"
				onClick={sendEmptyMove}
				disabled={!props.active}
			>
				PLAY!
			</button>
		</div>
	);
};
