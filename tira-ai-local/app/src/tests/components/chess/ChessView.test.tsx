// @vitest-environment jsdom

import { test, describe, expect, vi } from "vitest";
import { ChessView } from "../../../renderer/components/chess/ChessView";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { Position } from "kokopu";
import AIForm from "../../../renderer/components/AIForm";
import { GameButtons } from "../../../renderer/components/GameButtons";
import { useState } from "react";

describe("ChessView", () => {
	test("renders correctly", () => {
		const ui = (
			<ChessView
				setMoves={() => {}}
				moves={[]}
				setBoardIndex={() => {}}
				boardIndex={0}
				hasBeenSubmitted={false}
				setHasBeenSubmitted={() => {}}
				positions={[new Position()]}
				setPositions={() => {}}
				halfMoves={[]}
			/>
		);
		const board = render(ui);

		expect(board).not.toBe(null);

		board.unmount();
	});
	test("move buttons work", () => {
		function MockComponent() {
			const selectedGame = "chess";
			const [hasBeenSubmitted, setHasBeenSubmitted] = useState(false);
			const [boardIndex, setBoardIndex] = useState(0);
			const [halfMoves, setHalfMoves] = useState([]);
			const [positions, setPositions] = useState([new Position()]);
			const [moves, setMoves] = useState<string[]>([]);
			const [autoSendMove, setAutoSendMove] = useState(false);
			function handleSubmit(
				filepath: string,
				fennotation: string,
				runsetup: boolean,
			) {
				setBoardIndex(0);
				setHasBeenSubmitted(true);
				const fenList = fennotation.split(" ");
				setHalfMoves([parseInt(fenList[4])]);
				setMoves([]);
				try {
					setPositions([new Position(fennotation)]);
				} catch (error) {
					setPositions([new Position()]);
				}
			}

			function handleToggle() {
				setAutoSendMove(!autoSendMove);
			}

			function handlePrevMoveButton() {
				if (boardIndex > 0) {
					setBoardIndex(boardIndex - 1);
				}
			}

			function handleNextMoveButton() {
				if (boardIndex < positions.length - 1) {
					setBoardIndex(boardIndex + 1);
				}
			}

			return (
				<>
					<AIForm
						handleSubmit={handleSubmit}
						showFen={true}
						formId={""}
					/>
					<ChessView
						setMoves={setMoves}
						moves={moves}
						setBoardIndex={setBoardIndex}
						boardIndex={boardIndex}
						hasBeenSubmitted={hasBeenSubmitted}
						setHasBeenSubmitted={setHasBeenSubmitted}
						positions={positions}
						setPositions={setPositions}
						halfMoves={halfMoves}
					/>
					<GameButtons
						handlePrevMoveButton={handlePrevMoveButton}
						handleNextMoveButton={handleNextMoveButton}
						autoSendMove={autoSendMove}
						handleToggle={handleToggle}
						playActive={true}
						nextActive={true}
						prevActive={true}
						hasBeenSumbitted={true}
						gameOver={false}
					/>
				</>
			);
		}

		const ui = <MockComponent></MockComponent>;

		const { getAllByText, getByTestId } = render(ui);

		const submitButtons = getAllByText("SUBMIT");
		fireEvent.click(submitButtons[0]);

		const initialBoardIndex = getByTestId("board-index").textContent;

		fireEvent.click(getByTestId("next-move-button"));

		const updatedBoardIndex = getByTestId("board-index").textContent;

		expect(parseInt(updatedBoardIndex)).toBe(
			parseInt(initialBoardIndex) + 1,
		);

		fireEvent.click(getByTestId("prev-move-button"));

		const finalBoardIndex = getByTestId("board-index").textContent;

		expect(parseInt(finalBoardIndex)).toBe(parseInt(initialBoardIndex));
	});

	test("displays Black has won when White is checkmated", () => {
		const notification = vi.fn();
		const setGameOver = vi.fn();
		// Fool's mate position: White is in checkmate, turn is 'w'
		const pos = new Position(
			"rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3",
		);

		render(
			<ChessView
				positions={[pos]}
				setPositions={() => {}}
				moves={["f2f3", "e7e5", "g2g4", "d8h4"]}
				setMoves={() => {}}
				boardIndex={0}
				setBoardIndex={() => {}}
				halfMoves={[0]}
				hasBeenSubmitted={true}
				setHasBeenSubmitted={() => {}}
				notification={notification}
				setGameOver={setGameOver}
				gameOver={false}
			/>,
		);

		expect(notification).toHaveBeenCalledWith(
			"GAME OVER!",
			"Black has won the game",
		);
		expect(setGameOver).toHaveBeenCalledWith(true);
	});

	test("displays White has won when Black is checkmated", () => {
		const notification = vi.fn();
		const setGameOver = vi.fn();
		// Scholar's mate position: Black is in checkmate, turn is 'b'
		const pos = new Position(
			"r1bqkb1r/pppp1Qpp/2n5/4p3/2B1n3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4",
		);

		render(
			<ChessView
				positions={[pos]}
				setPositions={() => {}}
				moves={["e2e4", "e7e5", "f1c4", "b8c6", "d1h5", "g8f6", "h5f7"]}
				setMoves={() => {}}
				boardIndex={0}
				setBoardIndex={() => {}}
				halfMoves={[0]}
				hasBeenSubmitted={true}
				setHasBeenSubmitted={() => {}}
				notification={notification}
				setGameOver={setGameOver}
				gameOver={false}
			/>,
		);

		expect(notification).toHaveBeenCalledWith(
			"GAME OVER!",
			"White has won the game",
		);
		expect(setGameOver).toHaveBeenCalledWith(true);
	});
});
