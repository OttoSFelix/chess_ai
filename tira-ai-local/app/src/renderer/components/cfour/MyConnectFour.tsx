import { CFourUIPlayable } from "connect-four-board";
import { getData } from "../../UserData";
import { Chessboard } from "kokopu-react";
import { useEffect, useState } from "react";
/**
 * This is the Connect Four game board UI component.
 *
 * @param {object} props - Component props
 * @param {number[]} props.moves - Array containing the moves played in the game
 * @param {number} props.boardIndex - Index of the current move in the moves array
 * @param {Function} props.onMovePlayed - Function to handle a move played
 * @param {boolean} props.active - Flag indicating if the UI is active
 * @param {Function} [props.notification] - Function to display notifications
 *
 * @returns {JSX.Element} - React component representing the Connect Four game board UI
 */
export function MyConnectFour(props: {
	moves: number[];
	boardIndex: number;
	onMovePlayed(move: string);
	active: boolean;
	notification?(headear: string, body: string, bg?: string): void;
}) {
	const [circleRadius, setCircleRadius] = useState(40);
	const [circleMargin, setCircleMargin] = useState(5);

	const updateCircleDimensions = () => {
		const windowWidth = window.innerWidth;

		const newCircleRadius = Math.min(windowWidth * 0.035, 40);
		const newCircleMargin = Math.max(newCircleRadius * 0.125, 5);

		setCircleRadius(newCircleRadius);
		setCircleMargin(newCircleMargin);
	};

	useEffect(() => {
		updateCircleDimensions();
		window.addEventListener("resize", updateCircleDimensions);
		return () => {
			window.removeEventListener("resize", updateCircleDimensions);
		};
	}, []);

	function playMove(move: number) {
		if (props.active) {
			props.onMovePlayed(move.toString());
		} else if (props.boardIndex === 0) {
			props.notification(
				"AI Process Inactive",
				"The AI process must be active to interact with the game board. Input the path and press SUBMIT.",
			);
		} else {
			props.notification(
				"Game Over!",
				"Moves cannot be played because the game is over.",
			);
		}
	}
	const set = getData("color_set");
	const sets = Chessboard.colorsets();

	const primary = sets[set].b;
	const secondary = sets[set].w;
	const red = sets[set].cr;
	const yellow = sets[set].cy;
	const green = sets[set].cg;
	const blue = sets[set].cb;

	return (
		<div style={{ maxHeight: "100%", maxWidth: "100%" }}>
			<CFourUIPlayable
				rows={6}
				columns={7}
				gameMoves={props.moves}
				playMove={playMove}
				move_index={props.boardIndex}
				player_a_color={red}
				player_b_color={yellow}
				background_color={primary}
				highlight_color="black"
				// UI only calls playMove when it's active
				// To create notifications, UI must always be active
				active={true}
				circle_radius={circleRadius}
				circle_margin={circleMargin}
			/>
		</div>
	);
}
