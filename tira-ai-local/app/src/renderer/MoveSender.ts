import socket from "./MySocket";

let returnMove = true;
/**
 * sendMove Function
 *
 * Sends a move to the backend server via socket.
 *
 * @param {string} move - The move to be sent
 */
export function sendMove(move: string): void {
	socket.emit("move_to_back", move, returnMove);
}

/**
 * sendEmpty Function
 *
 * Sends an empty move to the backend server via socket.
 */
export function sendEmpty(): void {
	socket.emit("move_to_back", "", true);
}

/**
 * setReturnMove Function
 *
 * Sets the returnMove variable to control whether the backend server should return a move.
 *
 * @param {boolean} state - The state to set returnMove to
 */
export function setReturnMove(state: boolean): void {
	returnMove = state;
}

/**
 * startGame Function
 *
 * Sends a request to the backend server to start a new game.
 *
 * @param {string} filepath - The filepath of the game AI
 * @param {boolean} runsetup - Indicates whether to run setup for the game
 * @param {string} fennotation - Optional fennotation string for the game position
 */
export function startGame(
	filepath: string,
	runsetup: boolean,
	fennotation?: string,
): void {
	socket.emit(
		"startgame",
		filepath,
		fennotation ? fennotation != undefined : "",
		runsetup,
	);
}

/**
 * sendBoard Function
 *
 * Sends the current board position to the backend server via socket.
 *
 * @param {string} fen - The FEN notation of the current board position
 */
export function sendBoard(fen: string): void {
	socket.emit("set_board", fen);
}

/**
 * killProcess Function
 *
 * Sends a request to the backend server to kill the AI process.
 */
export function killProcess(): void {
	socket.emit("kill");
}

/**
 * handleMovePlayedByAi Variable
 *
 * Stores a function to handle moves played by the AI.
 */
let handleMovePlayedByAi: Function | undefined;

/**
 * sethandleMovePlayedByAi Function
 *
 * Sets the handleMovePlayedByAi function.
 *
 * @param {Function} func - The function to handle moves played by the AI
 */
export function sethandleMovePlayedByAi(func: Function): void {
	handleMovePlayedByAi = func;
}

socket.on("move_to_front", (move: string) => {
	console.log("socket:", move);

	if (handleMovePlayedByAi != undefined) {
		handleMovePlayedByAi(move);
	}
});

/**
 * showRuntimeError Variable
 *
 * Stores a function to display runtime errors.
 */
let showRuntimeError: Function | undefined;

/**
 * setShowRuntimeError Function
 *
 * Sets the showRuntimeError function.
 *
 * @param {Function} func - The function to display runtime errors
 */
export function setShowRuntimeError(func: Function): void {
	showRuntimeError = func;
}

socket.on("runtime_error", () => {
	console.log("runtime_error");
	if (showRuntimeError != undefined) {
		showRuntimeError(
			"Runtime Error!",
			"The AI process is no longer active! See the logs for more details.",
			"danger",
		);
	}
});
