interface CFourParserProps {
	moves: number[];
	boardIndex: number;
}

/**
 * Parses Connect Four moves into a matrix representing the game board.
 * @param {number[]} moves An array of moves indicating the column index where each move was made.
 * @param {number} boardIndex The index of the board representing how many moves to parse.
 * @returns A matrix representing the game board after parsing the moves.
 */
const CFourParser = ({ moves, boardIndex }: CFourParserProps) => {
	const columns: number[][] = Array.from({ length: 7 }, () =>
		Array(6).fill(0),
	);

	let movesAdded = 0;

	moves.forEach((move, index) => {
		if (move >= 0 && move < 7 && movesAdded < boardIndex) {
			for (let row = 5; row >= 0; row--) {
				if (columns[move][row] === 0) {
					columns[move][row] = (index % 2) + 1;
					movesAdded++;
					break;
				}
			}
		}
	});

	return columns;
};

export default CFourParser;
