/**
 * Checks if there is a winner in the Connect Four game based on the provided game board.
 *
 * @param {number[][]} board - 2D array representing the game board
 * @returns {boolean} - True if there is a winner, false otherwise
 */
function checkForWin(board: number[][]): boolean {
	for (let col = 0; col < 4; col++) {
		for (let row = 0; row < 6; row++) {
			if (
				board[col][row] !== 0 &&
				board[col][row] === board[col + 1][row] &&
				board[col][row] === board[col + 2][row] &&
				board[col][row] === board[col + 3][row]
			) {
				return true;
			}
		}
	}

	for (let col = 0; col < 7; col++) {
		for (let row = 0; row < 3; row++) {
			if (
				board[col][row] !== 0 &&
				board[col][row] === board[col][row + 1] &&
				board[col][row] === board[col][row + 2] &&
				board[col][row] === board[col][row + 3]
			) {
				return true;
			}
		}
	}

	for (let col = 0; col < 4; col++) {
		for (let row = 3; row < 6; row++) {
			if (
				board[col][row] !== 0 &&
				board[col][row] === board[col + 1][row - 1] &&
				board[col][row] === board[col + 2][row - 2] &&
				board[col][row] === board[col + 3][row - 3]
			) {
				return true;
			}
		}
	}

	for (let col = 0; col < 4; col++) {
		for (let row = 0; row < 3; row++) {
			if (
				board[col][row] !== 0 &&
				board[col][row] === board[col + 1][row + 1] &&
				board[col][row] === board[col + 2][row + 2] &&
				board[col][row] === board[col + 3][row + 3]
			) {
				return true;
			}
		}
	}

	return false;
}

export default checkForWin;
