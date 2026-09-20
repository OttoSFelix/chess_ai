import { createRoot } from "react-dom/client";
import { GameSelector } from "./components/GameSelector";
import { ChessView } from "./components/chess/ChessView";
import { CFourView } from "./components/cfour/CFourView";
import { useState } from "react";
import AIForm from "./components/AIForm";
import socket from "./MySocket";
import { Position } from "kokopu";
import {
	killProcess,
	startGame,
	setReturnMove,
	sendBoard as sendBoard,
	setShowRuntimeError,
} from "./MoveSender";
import { Logs } from "./components/Logs";
import { createPGNString } from "./PGNFormatter";
import { GameButtons } from "./components/GameButtons";
import { Notification } from "./components/Notification";
import { MiscButtons } from "./components/MiscButtons";
import "./css/AppLayout.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { getData, setData } from "./UserData";
import { Settings } from "./components/Settings";

/**
 * Represents the main application component.
 *
 * @returns {JSX.Element} - React component representing the main application
 */
function App() {
	const [selectedGame, setSelectedGame] = useState<string | null>(
		getData("game"),
	);
	const [hasBeenSubmitted, setHasBeenSubmitted] = useState(false);
	const [boardIndex, setBoardIndex] = useState(0);
	const [halfMoves, setHalfMoves] = useState([]);
	const [positions, setPositions] = useState([new Position()]);
	const [moves, setMoves] = useState<string[]>([]);
	const [autoSendMove, setAutoSendMove] = useState(false);
	const [startingFullMoveCount, setStartingFullMoveCount] =
		useState<number>(0);
	const [gameOver, setGameOver] = useState<boolean>(false);

	const [toastHeader, setToastHeader] = useState("");
	const [toastBody, setToastBody] = useState("");
	const [toastBg, setToastBg] = useState("");
	const [showToast, setShowToast] = useState(false);

	const [pieceset, setPieceset] = useState<string>(getData("piece_set"));
	const [colorset, setColorset] = useState<string>(getData("color_set"));
	const [arrow, setArrow] = useState<string>(getData("arrow"));

	const handleGameSelection = (game: string) => {
		setMoves([]);
		setHalfMoves([]);
		setPositions([new Position()]);
		setBoardIndex(0);
		setSelectedGame(game);
		if (hasBeenSubmitted) {
			killProcess();
		}
		setHasBeenSubmitted(false);
		setData("game", game);
	};

	function handleSubmit(
		filepath: string,
		fennotation: string,
		runsetup: boolean,
	) {
		if (selectedGame === "chess") {
			socket.emit("startgame", filepath, fennotation, runsetup);
			if (fennotation) {
				const fenList = fennotation.split(" ");
				setHalfMoves([parseInt(fenList[4])]);
				setStartingFullMoveCount(parseInt(fenList[5]));
			} else {
				setHalfMoves([]);
				setStartingFullMoveCount(0);
			}
			try {
				setPositions([new Position(fennotation)]);
			} catch (error) {
				setPositions([new Position()]);
			}
		} else if (selectedGame === "connectFour") {
			startGame(filepath, runsetup);
		}
		setMoves([]);
		setBoardIndex(0);
		setHasBeenSubmitted(true);
		setGameOver(false);
	}

	const fullMoves = (index: number) => {
		return Math.floor(index / 2) + 1;
	};

	function exportPgn() {
		const pgn = createPGNString(moves, createFen(0), fullMoves(boardIndex));
		navigator.clipboard
			.writeText(pgn)
			.then(() => {
				createNotification("Copied PGN to clipboard!", pgn, "");
			})
			.catch((err) => {
				createNotification(
					"Error copying PGN notation to clipboard",
					err,
					"danger",
				);
			});
	}

	function createFen(index: number) {
		const halfMove: number = halfMoves[index];
		const fullMove: number = fullMoves(index) + startingFullMoveCount;

		const fen = positions[index].fen({
			fiftyMoveClock: !isNaN(halfMove) ? halfMove : 0,
			fullMoveNumber: fullMove,
		});
		return fen;
	}

	function handleToggle() {
		setAutoSendMove(!autoSendMove);
		setReturnMove(autoSendMove);
	}

	function handlePrevMoveButton() {
		if (boardIndex > 0) {
			setGameOver(false);
			setBoardIndex(boardIndex - 1);
			if (selectedGame === "chess") {
				const fen = createFen(boardIndex - 1);
				sendBoard(fen);
			} else if (selectedGame === "connectFour") {
				sendBoard(moves.slice(0, boardIndex - 1).join(","));
			}
		}
	}

	function handleNextMoveButton() {
		if (hasBeenSubmitted) {
			if (selectedGame === "chess") {
				if (boardIndex < positions.length - 1) {
					const fen = createFen(boardIndex + 1);
					sendBoard(fen);
					setBoardIndex(boardIndex + 1);
				}
			} else if (selectedGame === "connectFour") {
				if (boardIndex < moves.length - 1) {
					sendBoard(moves.slice(0, boardIndex - 1).join(","));
					setBoardIndex(boardIndex + 1);
				}
			}
		}
	}

	function handleResetBoard() {
		setMoves([]);
		setHalfMoves([]);
		setStartingFullMoveCount(0);
		setPositions([new Position()]);
		setBoardIndex(0);
		setGameOver(false);
		if (selectedGame === "chess") {
			sendBoard(
				"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
			);
		} else if (selectedGame === "connectFour") {
			sendBoard("");
		}
	}

	function createNotification(header: string, body: string, bg?: string) {
		setToastBody(body);
		setToastHeader(header);
		setToastBg(bg === undefined ? "" : bg);
		setShowToast(true);
	}

	setShowRuntimeError(createNotification);

	return (
		<div
			style={{ display: "flex", flexDirection: "column", height: "100%" }}
		>
			<GameSelector onSelect={handleGameSelection} />
			<div
				style={{
					padding: "20px",
					display: "flex",
					flexDirection: "column",
					height: "100%",
				}}
			>
				<Notification
					show={showToast}
					onClose={() => setShowToast(false)}
					headerText={toastHeader}
					bodyText={toastBody}
					bg={toastBg}
				/>
				{selectedGame !== null ? (
					<div id="app-center">
						<div className="cards">
							<AIForm
								handleSubmit={handleSubmit}
								showFen={selectedGame === "chess"}
								formId="formChess"
							/>
						</div>
						<div className="game-layout">
							{selectedGame === "chess" ? (
								<>
									<div id="fen">{createFen(boardIndex)}</div>
									<ChessView
										setBoardIndex={setBoardIndex}
										boardIndex={boardIndex}
										hasBeenSubmitted={hasBeenSubmitted}
										setHasBeenSubmitted={
											setHasBeenSubmitted
										}
										moves={moves}
										setMoves={setMoves}
										halfMoves={halfMoves}
										setPositions={setPositions}
										positions={positions}
										notification={createNotification}
										setGameOver={setGameOver}
										gameOver={gameOver}
										onResetBoard={handleResetBoard}
									/>
								</>
							) : selectedGame === "connectFour" ? (
								<CFourView
									moves={moves}
									boardIndex={boardIndex}
									hasBeenSubmitted={hasBeenSubmitted}
									setBoardIndex={setBoardIndex}
									setMoves={setMoves}
									notification={createNotification}
									setHasBeenSubmitted={setHasBeenSubmitted}
									setGameOver={setGameOver}
									gameOver={gameOver}
								/>
							) : null}
							<GameButtons
								handlePrevMoveButton={handlePrevMoveButton}
								handleNextMoveButton={handleNextMoveButton}
								autoSendMove={autoSendMove}
								handleToggle={handleToggle}
								playActive={hasBeenSubmitted}
								prevActive={boardIndex > 0}
								nextActive={
									selectedGame === "chess"
										? boardIndex < positions.length - 1
										: selectedGame === "connectFour"
											? boardIndex < moves.length - 1
											: false
								}
								hasBeenSumbitted={hasBeenSubmitted}
								gameOver={gameOver}
							/>
						</div>

						<div id="misc-buttons">
							<MiscButtons
								selectedGame={selectedGame}
								boardIndex={boardIndex}
								createFen={createFen}
								exportPgn={exportPgn}
								createNotification={createNotification}
								setHasBeenSubmitted={setHasBeenSubmitted}
								handleResetBoard={handleResetBoard}
							/>
							<Settings
								pieceset={pieceset}
								setPieceset={setPieceset}
								colorset={colorset}
								setColorset={setColorset}
								arrow={arrow}
								setArrow={setArrow}
								chessButtons={selectedGame === "chess"}
							/>
						</div>
					</div>
				) : null}
				<br />
				{selectedGame && <Logs />}
			</div>
		</div>
	);
}

export function render() {
	const root = createRoot(document.getElementById("root"));
	root.render(<App />);
}
