import { MyChessboard } from "./MyChessboard";
import { MoveDescriptor, Position } from "kokopu";
import "../../css/GameView.css";
import { getData } from "../../UserData";
import { useState, useEffect, useRef } from "react";
import { ChessClock } from "./ChessClock";
import { setReturnMove } from "../../MoveSender";

/**
 * This is the view for the Chess game.
 *
 * @param {object} props - Component props
 * @param {Position[]} props.positions - Array containing positions in the game
 * @param {Function} props.setMoves - Function to set the moves array
 * @param {Function} props.setPositions - Function to set the positions array
 * @param {boolean} props.hasBeenSubmitted - Flag indicating if moves have been submitted
 * @param {Function} props.setHasBeenSubmitted - Function to set the hasBeenSubmitted flag
 * @param {number[]} props.halfMoves - Array containing half moves
 * @param {string[]} props.moves - Array containing the moves played in the game
 * @param {Function} props.setBoardIndex - Function to set the board index
 * @param {number} props.boardIndex - Index of the current board state in the positions array
 * @param {Function} [props.notification] - Function to display notifications
 * @param {boolean} [props.gameOver] - Flag indicating if the game is over
 * @param {Function} [props.setGameOver] - Function to set the game over flag
 * @param {Function} [props.onResetBoard] - Function to handle resetting the board
 *
 * @returns {JSX.Element} - React component representing the Chess game view
 */
export function ChessView(props: {
	positions: Position[];
	setMoves(arg0: (prevMoves: string[]) => string[]): void;
	setPositions(arg0: (prevState: Position[]) => Position[]): void;
	hasBeenSubmitted: boolean;
	setHasBeenSubmitted(arg0: boolean): void;
	halfMoves: number[];
	moves: string[];
	setBoardIndex(arg0: number): void;
	boardIndex: number;
	notification?(header, body, bg?): void;
	gameOver?: boolean;
	setGameOver?(arg0: boolean): void;
	onResetBoard?(): void;
}) {
	const [maxTimeMinutes, setMaxTimeMinutes] = useState<number>(10);
	const [whiteTime, setWhiteTime] = useState<number>(10 * 60);
	const [blackTime, setBlackTime] = useState<number>(10 * 60);
	const [activeSide, setActiveSide] = useState<"w" | "b" | null>(null);
	const lastTickRef = useRef<number | null>(null);
	const timeoutNotifiedRef = useRef<boolean>(false);

	const isTimeout = whiteTime <= 0 || blackTime <= 0;
	const isConfigurable =
		activeSide === null && props.moves.length === 0 && !isTimeout;

	const handleMaxTimeMinutesChange = (newMinutes: number) => {
		setMaxTimeMinutes(newMinutes);
		if (isConfigurable) {
			setWhiteTime(newMinutes * 60);
			setBlackTime(newMinutes * 60);
		}
	};

	const handleReset = () => {
		setActiveSide(null);
		setWhiteTime(maxTimeMinutes * 60);
		setBlackTime(maxTimeMinutes * 60);
		lastTickRef.current = null;
		timeoutNotifiedRef.current = false;
		if (props.onResetBoard) {
			props.onResetBoard();
		} else {
			props.setMoves(() => []);
			props.setPositions(() => [new Position()]);
			props.setBoardIndex(0);
			props.setGameOver?.(false);
		}
	};

	// Reset clock if game is reset externally (e.g. from AIForm or MiscButtons)
	useEffect(() => {
		if (props.moves.length === 0 && props.boardIndex === 0) {
			setActiveSide(null);
			setWhiteTime(maxTimeMinutes * 60);
			setBlackTime(maxTimeMinutes * 60);
			lastTickRef.current = null;
			timeoutNotifiedRef.current = false;
		}
	}, [props.moves.length, props.boardIndex, maxTimeMinutes]);

	// Countdown timer interval
	useEffect(() => {
		if (
			activeSide === null ||
			props.gameOver ||
			isTimeout ||
			!props.hasBeenSubmitted
		) {
			return;
		}

		lastTickRef.current = Date.now();

		const intervalId = setInterval(() => {
			const now = Date.now();
			const elapsed = (now - (lastTickRef.current ?? now)) / 1000;
			lastTickRef.current = now;

			if (activeSide === "w") {
				setWhiteTime((prev) => Math.max(0, prev - elapsed));
			} else if (activeSide === "b") {
				setBlackTime((prev) => Math.max(0, prev - elapsed));
			}
		}, 100);

		return () => clearInterval(intervalId);
	}, [activeSide, props.gameOver, isTimeout, props.hasBeenSubmitted]);

	// Flag fall (timeout) check
	useEffect(() => {
		if (props.gameOver || timeoutNotifiedRef.current) {
			return;
		}

		if (whiteTime <= 0) {
			timeoutNotifiedRef.current = true;
			setActiveSide(null);
			setReturnMove(false);
			if (props.notification) {
				props.notification(
					"GAME OVER!",
					"White ran out of time! Black has won the game.",
					"danger",
				);
			}
			props.setGameOver?.(true);
		} else if (blackTime <= 0) {
			timeoutNotifiedRef.current = true;
			setActiveSide(null);
			setReturnMove(false);
			if (props.notification) {
				props.notification(
					"GAME OVER!",
					"Black ran out of time! White has won the game.",
					"danger",
				);
			}
			props.setGameOver?.(true);
		}
	}, [whiteTime, blackTime, props.gameOver]);

	// Ensure gameOver stays true if timeout has occurred
	useEffect(() => {
		if (isTimeout && !props.gameOver) {
			props.setGameOver?.(true);
		}
	}, [isTimeout, props.gameOver]);

	const isGameOver = props.positions[props.boardIndex].isCheckmate() === true;
	const turn = props.positions[props.boardIndex].turn();

	const stalemate = props.positions[props.boardIndex].isStalemate() === true;
	const dead = props.positions[props.boardIndex].isDead() === true;
	const halfMoveCount = props.halfMoves[props.boardIndex] >= 100;

	const isTie = stalemate || dead || halfMoveCount;

	useEffect(() => {
		if (isGameOver || isTie) {
			setActiveSide(null);
			setReturnMove(false);
		}
	}, [isGameOver, isTie]);

	function addPosition(position: Position, move: MoveDescriptor) {
		if (isGameOver || isTie || props.gameOver || isTimeout) {
			return;
		}

		const currentPosition = props.positions[props.boardIndex];
		const movingSide = currentPosition.turn();

		props.setPositions((prevState) => {
			const sliced = prevState.slice(0, props.boardIndex + 1);
			return sliced.concat(position);
		});
		props.setBoardIndex(props.boardIndex + 1);
		updateHalfMoveCounter(move);
		props.setMoves((prevMoves) => {
			const slicedMoves = prevMoves.slice(0, props.boardIndex);
			return slicedMoves.concat(position.uci(move));
		});

		// Clock handling:
		// White's first move: White gets +10s increment and Black's clock automatically starts
		const time_increment = 2;
		if (activeSide === null) {
			if (movingSide === "w") {
				setWhiteTime((prev) => prev + time_increment);
				setActiveSide("b");
				lastTickRef.current = Date.now();
			} else {
				setBlackTime((prev) => prev + time_increment);
				setActiveSide("w");
				lastTickRef.current = Date.now();
			}
		} else {
			// Subsequent moves: +10s increment and switch active clock
			if (movingSide === "w") {
				setWhiteTime((prev) => prev + time_increment);
				setActiveSide("b");
				lastTickRef.current = Date.now();
			} else {
				setBlackTime((prev) => prev + time_increment);
				setActiveSide("w");
				lastTickRef.current = Date.now();
			}
		}
	}

	function updateHalfMoveCounter(move: MoveDescriptor) {
		if (move.movingPiece() === "p" || move.isCapture()) {
			props.halfMoves[props.boardIndex + 1] = 0;
		} else {
			props.halfMoves[props.boardIndex + 1] =
				props.halfMoves[props.boardIndex] + 1;
		}
	}

	function makeArrowString() {
		if (props.boardIndex < 1) {
			return "";
		}
		const from: string = props.moves[props.boardIndex - 1].slice(0, 2);
		const to: string = props.moves[props.boardIndex - 1].slice(2, 4);
		const color: string = getData("arrow");
		return `${color}${from}${to}`;
	}

	if (!props.gameOver) {
		if (isGameOver) {
			const winner = turn === "b" ? "White" : "Black";
			props.notification?.("GAME OVER!", `${winner} has won the game`);
			props.setGameOver?.(true);
		} else if (isTie) {
			const endType = stalemate
				? "of a stalemate"
				: dead
					? "neither side has enough material to win"
					: "it has been 100 moves since last capture or pawn advance";
			props.notification?.(
				"GAME OVER!",
				`Game was declared a tie because ${endType}.`,
			);
			props.setGameOver?.(true);
		}
	}

	return (
		<div id="game-view">
			<ChessClock
				whiteTime={whiteTime}
				blackTime={blackTime}
				activeSide={activeSide}
				maxTimeMinutes={maxTimeMinutes}
				onMaxTimeMinutesChange={handleMaxTimeMinutesChange}
				isConfigurable={isConfigurable}
				onReset={handleReset}
			>
				<MyChessboard
					pos={props.positions[props.boardIndex]}
					addPosition={addPosition}
					active={
						!(isGameOver || isTie || props.gameOver || isTimeout) &&
						props.hasBeenSubmitted
					}
					notification={props.notification}
					arrow={makeArrowString()}
				/>
			</ChessClock>
			<div data-testid="board-index">Turn {props.boardIndex}</div>
		</div>
	);
}
