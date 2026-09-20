import { Chessboard } from "kokopu-react";
import { setData, getData } from "../UserData";
import "../css/Settings.css";

/**
 * Represents settings for the game interface.
 *
 * @param {object} props - Component props
 * @param {string} props.pieceset - Selected chess piece set
 * @param {Function} props.setPieceset - Function to set the chess piece set
 * @param {string} props.colorset - Selected color theme
 * @param {Function} props.setColorset - Function to set the color theme
 * @param {string} props.arrow - Selected color for the move arrow
 * @param {Function} props.setArrow - Function to set the color for the move arrow
 * @param {boolean} props.chessButtons - Flag indicating if chess buttons are enabled
 *
 * @returns {JSX.Element} - React component representing the settings
 */
export function Settings(props: {
	pieceset: string;
	setPieceset(set: string): void;
	colorset: string;
	setColorset(set: string): void;
	arrow: string;
	setArrow(set: string): void;
	chessButtons: boolean;
}) {
	const piecesets = Chessboard.piecesets();
	const colorsets = Chessboard.colorsets();

	const root = document.documentElement;
	root.style.setProperty("--primary", colorsets[props.colorset].b);
	root.style.setProperty("--secondary", colorsets[props.colorset].w);
	root.style.setProperty("--blue_marker", colorsets[props.colorset].cb);
	root.style.setProperty("--green_marker", colorsets[props.colorset].cg);
	root.style.setProperty("--red_marker", colorsets[props.colorset].cr);
	root.style.setProperty("--yellow_marker", colorsets[props.colorset].cy);

	const handlePiecesetChange = (
		event: React.ChangeEvent<HTMLSelectElement>,
	) => {
		const newPieceset = event.target.value;
		props.setPieceset(newPieceset);
		setData("piece_set", newPieceset);
	};

	const handleColorsetChange = (
		event: React.ChangeEvent<HTMLSelectElement>,
	) => {
		const newColorset = event.target.value;
		props.setColorset(newColorset);
		setData("color_set", newColorset);
	};

	const handleArrowChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const newArrow = event.target.value;
		props.setArrow(newArrow);
		setData("arrow", newArrow);
	};

	return (
		<div id="settings">
			<select
				className="classic-button"
				value={props.colorset}
				onChange={handleColorsetChange}
				title="Select the color theme"
				data-testid="color-button"
			>
				{Object.keys(colorsets).map((set) => (
					<option key={set} value={set}>
						{set}
					</option>
				))}
			</select>
			{props.chessButtons ? (
				<>
					<select
						className="classic-button"
						value={props.pieceset}
						onChange={handlePiecesetChange}
						title="Select the style of chess pieces"
					>
						{Object.keys(piecesets).map((set) => (
							<option key={set} value={set}>
								{set}
							</option>
						))}
					</select>

					<select
						className="classic-button"
						value={props.arrow}
						onChange={handleArrowChange}
						title="Select the color of the move arrow"
					>
						<option value="">Disabled</option>
						<option value="R">Red</option>
						<option value="G">Green</option>
						<option value="B">Blue</option>
						<option value="Y">Yellow</option>
					</select>
				</>
			) : null}
		</div>
	);
}
