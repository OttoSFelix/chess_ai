// @vitest-environment jsdom

import { test, describe, expect, vi, afterEach } from "vitest";
import React, { useState } from "react";
import { render, fireEvent, cleanup, act } from "@testing-library/react";
import {
	ChessClock,
	formatTime,
} from "../../../renderer/components/chess/ChessClock";
import { ChessView } from "../../../renderer/components/chess/ChessView";
import { Position } from "kokopu";
import * as MoveSender from "../../../renderer/MoveSender";

afterEach(() => {
	cleanup();
});

describe("formatTime", () => {
	test("formats whole minutes correctly", () => {
		expect(formatTime(600)).toBe("10:00");
		expect(formatTime(300)).toBe("05:00");
		expect(formatTime(60)).toBe("01:00");
	});

	test("formats seconds with leading zeros", () => {
		expect(formatTime(65)).toBe("01:05");
		expect(formatTime(9)).toBe("00:09");
		expect(formatTime(0)).toBe("00:00");
	});

	test("handles fractional seconds with ceil", () => {
		expect(formatTime(9.2)).toBe("00:10");
		expect(formatTime(0.1)).toBe("00:01");
	});

	test("clamps negative seconds to 00:00", () => {
		expect(formatTime(-5)).toBe("00:00");
	});

	test("formats hours when totalSeconds >= 3600", () => {
		expect(formatTime(3600)).toBe("1:00:00");
		expect(formatTime(3665)).toBe("1:01:05");
	});
});

describe("ChessClock component", () => {
	test("renders black and white clocks with formatted time", () => {
		const { getByTestId } = render(
			<ChessClock
				whiteTime={600}
				blackTime={600}
				activeSide={null}
				maxTimeMinutes={10}
				onMaxTimeMinutesChange={() => {}}
				isConfigurable={true}
			/>,
		);

		expect(getByTestId("black-clock-time").textContent).toBe("10:00");
		expect(getByTestId("white-clock-time").textContent).toBe("10:00");
	});

	test("highlights the active clock", () => {
		const { getByTestId, rerender } = render(
			<ChessClock
				whiteTime={590}
				blackTime={600}
				activeSide="w"
				maxTimeMinutes={10}
				onMaxTimeMinutesChange={() => {}}
				isConfigurable={false}
			/>,
		);

		expect(getByTestId("white-clock").classList.contains("active")).toBe(
			true,
		);
		expect(getByTestId("black-clock").classList.contains("active")).toBe(
			false,
		);

		rerender(
			<ChessClock
				whiteTime={590}
				blackTime={580}
				activeSide="b"
				maxTimeMinutes={10}
				onMaxTimeMinutesChange={() => {}}
				isConfigurable={false}
			/>,
		);

		expect(getByTestId("white-clock").classList.contains("active")).toBe(
			false,
		);
		expect(getByTestId("black-clock").classList.contains("active")).toBe(
			true,
		);
	});

	test("allows changing max minutes when configurable", () => {
		const onMinutesChange = vi.fn();
		const { getByTestId } = render(
			<ChessClock
				whiteTime={600}
				blackTime={600}
				activeSide={null}
				maxTimeMinutes={10}
				onMaxTimeMinutesChange={onMinutesChange}
				isConfigurable={true}
			/>,
		);

		const input = getByTestId("chess-clock-time-input") as HTMLInputElement;
		expect(input.disabled).toBe(false);

		fireEvent.change(input, { target: { value: "5" } });
		expect(onMinutesChange).toHaveBeenCalledWith(5);
	});

	test("disables max minutes input when not configurable", () => {
		const { getByTestId } = render(
			<ChessClock
				whiteTime={600}
				blackTime={600}
				activeSide="b"
				maxTimeMinutes={10}
				onMaxTimeMinutesChange={() => {}}
				isConfigurable={false}
			/>,
		);

		const input = getByTestId("chess-clock-time-input") as HTMLInputElement;
		expect(input.disabled).toBe(true);
	});

	test("calls onReset when reset button is clicked", () => {
		const onReset = vi.fn();
		const { getByTestId } = render(
			<ChessClock
				whiteTime={550}
				blackTime={570}
				activeSide="w"
				maxTimeMinutes={10}
				onMaxTimeMinutesChange={() => {}}
				isConfigurable={false}
				onReset={onReset}
			/>,
		);

		fireEvent.click(getByTestId("chess-clock-reset-btn"));
		expect(onReset).toHaveBeenCalledTimes(1);
	});
});

describe("ChessView clock integration", () => {
	function TestHarness() {
		const [positions, setPositions] = useState<Position[]>([
			new Position(),
		]);
		const [moves, setMoves] = useState<string[]>([]);
		const [boardIndex, setBoardIndex] = useState(0);
		const [halfMoves, setHalfMoves] = useState<number[]>([]);
		const [gameOver, setGameOver] = useState(false);

		return (
			<ChessView
				positions={positions}
				setPositions={setPositions}
				moves={moves}
				setMoves={setMoves}
				boardIndex={boardIndex}
				setBoardIndex={setBoardIndex}
				halfMoves={halfMoves}
				hasBeenSubmitted={true}
				setHasBeenSubmitted={() => {}}
				gameOver={gameOver}
				setGameOver={setGameOver}
			/>
		);
	}

	test("initializes with 10:00 for both sides and input editable", () => {
		const { getByTestId } = render(<TestHarness />);

		expect(getByTestId("white-clock-time").textContent).toBe("10:00");
		expect(getByTestId("black-clock-time").textContent).toBe("10:00");

		const input = getByTestId("chess-clock-time-input") as HTMLInputElement;
		expect(input.disabled).toBe(false);

		// Change time limit to 5 minutes
		fireEvent.change(input, { target: { value: "5" } });
		expect(getByTestId("white-clock-time").textContent).toBe("05:00");
		expect(getByTestId("black-clock-time").textContent).toBe("05:00");
	});

	test("resets clock to initial time on reset button click", () => {
		const { getByTestId } = render(<TestHarness />);

		const input = getByTestId("chess-clock-time-input") as HTMLInputElement;
		fireEvent.change(input, { target: { value: "15" } });

		expect(getByTestId("white-clock-time").textContent).toBe("15:00");
		expect(getByTestId("black-clock-time").textContent).toBe("15:00");

		fireEvent.click(getByTestId("chess-clock-reset-btn"));

		expect(getByTestId("white-clock-time").textContent).toBe("15:00");
		expect(getByTestId("black-clock-time").textContent).toBe("15:00");
		expect(
			(getByTestId("chess-clock-time-input") as HTMLInputElement)
				.disabled,
		).toBe(false);
	});

	test("White's first move grants increment and starts Black's clock", () => {
		let aiMoveHandler: any;
		vi.spyOn(MoveSender, "sethandleMovePlayedByAi").mockImplementation(
			(fn) => {
				aiMoveHandler = fn;
			},
		);

		function MoveTestHarness() {
			const [positions, setPositions] = useState<Position[]>([
				new Position(),
			]);
			const [moves, setMoves] = useState<string[]>([]);
			const [boardIndex, setBoardIndex] = useState(0);
			const [halfMoves, setHalfMoves] = useState<number[]>([]);
			const [gameOver, setGameOver] = useState(false);

			return (
				<ChessView
					positions={positions}
					setPositions={setPositions}
					moves={moves}
					setMoves={setMoves}
					boardIndex={boardIndex}
					setBoardIndex={setBoardIndex}
					halfMoves={halfMoves}
					hasBeenSubmitted={true}
					setHasBeenSubmitted={() => {}}
					gameOver={gameOver}
					setGameOver={setGameOver}
				/>
			);
		}

		const { getByTestId } = render(<MoveTestHarness />);

		// Before move: White 10:00, Black 10:00, neither active
		expect(getByTestId("white-clock-time").textContent).toBe("10:00");
		expect(getByTestId("black-clock-time").textContent).toBe("10:00");
		expect(getByTestId("black-clock").classList.contains("active")).toBe(
			false,
		);
		expect(getByTestId("white-clock").classList.contains("active")).toBe(
			false,
		);

		act(() => {
			aiMoveHandler("e2e4");
		});

		// White got increment (+2s -> 10:02) and Black clock became active
		expect(getByTestId("white-clock-time").textContent).toBe("10:02");
		expect(getByTestId("black-clock").classList.contains("active")).toBe(
			true,
		);
		expect(getByTestId("white-clock").classList.contains("active")).toBe(
			false,
		);
	});

	test("game stops entirely when Black runs out of time", () => {
		vi.useFakeTimers();
		let aiMoveHandler: any;
		vi.spyOn(MoveSender, "sethandleMovePlayedByAi").mockImplementation(
			(fn) => {
				aiMoveHandler = fn;
			},
		);

		const notification = vi.fn();
		const setGameOverMock = vi.fn();

		function TimeoutTestHarness() {
			const [positions, setPositions] = useState<Position[]>([
				new Position(),
			]);
			const [moves, setMoves] = useState<string[]>([]);
			const [boardIndex, setBoardIndex] = useState(0);
			const [halfMoves, setHalfMoves] = useState<number[]>([]);
			const [gameOver, setGameOver] = useState(false);

			return (
				<ChessView
					positions={positions}
					setPositions={setPositions}
					moves={moves}
					setMoves={setMoves}
					boardIndex={boardIndex}
					setBoardIndex={setBoardIndex}
					halfMoves={halfMoves}
					hasBeenSubmitted={true}
					setHasBeenSubmitted={() => {}}
					notification={notification}
					gameOver={gameOver}
					setGameOver={(val) => {
						setGameOver(val);
						setGameOverMock(val);
					}}
				/>
			);
		}

		const { getByTestId } = render(<TimeoutTestHarness />);

		// White plays e2e4, starting Black's clock
		act(() => {
			aiMoveHandler("e2e4");
		});

		expect(getByTestId("black-clock").classList.contains("active")).toBe(
			true,
		);

		// Advance time so Black runs out of time (10 minutes = 600 seconds)
		act(() => {
			vi.advanceTimersByTime(602000);
		});

		// Notification displayed
		expect(notification).toHaveBeenCalledWith(
			"GAME OVER!",
			"Black ran out of time! White has won the game.",
			"danger",
		);
		expect(setGameOverMock).toHaveBeenCalledWith(true);

		// Black clock at 00:00 and activeSide is null (no active clock)
		expect(getByTestId("black-clock-time").textContent).toBe("00:00");
		expect(getByTestId("black-clock").classList.contains("active")).toBe(
			false,
		);
		expect(getByTestId("white-clock").classList.contains("active")).toBe(
			false,
		);

		// Attempt to make another move after timeout
		act(() => {
			aiMoveHandler("e7e5");
		});

		// Black clock must NOT get increment and White clock must NOT start
		expect(getByTestId("black-clock-time").textContent).toBe("00:00");
		expect(getByTestId("white-clock").classList.contains("active")).toBe(
			false,
		);
		expect(getByTestId("black-clock").classList.contains("active")).toBe(
			false,
		);

		vi.useRealTimers();
	});

	test("game stops entirely when White runs out of time", () => {
		vi.useFakeTimers();
		let aiMoveHandler: any;
		vi.spyOn(MoveSender, "sethandleMovePlayedByAi").mockImplementation(
			(fn) => {
				aiMoveHandler = fn;
			},
		);

		const notification = vi.fn();
		const setGameOverMock = vi.fn();

		function TimeoutTestHarness() {
			const [positions, setPositions] = useState<Position[]>([
				new Position(),
			]);
			const [moves, setMoves] = useState<string[]>([]);
			const [boardIndex, setBoardIndex] = useState(0);
			const [halfMoves, setHalfMoves] = useState<number[]>([]);
			const [gameOver, setGameOver] = useState(false);

			return (
				<ChessView
					positions={positions}
					setPositions={setPositions}
					moves={moves}
					setMoves={setMoves}
					boardIndex={boardIndex}
					setBoardIndex={setBoardIndex}
					halfMoves={halfMoves}
					hasBeenSubmitted={true}
					setHasBeenSubmitted={() => {}}
					notification={notification}
					gameOver={gameOver}
					setGameOver={(val) => {
						setGameOver(val);
						setGameOverMock(val);
					}}
				/>
			);
		}

		const { getByTestId } = render(<TimeoutTestHarness />);

		// White plays e2e4, then Black plays e7e5, switching clock back to White
		act(() => {
			aiMoveHandler("e2e4");
		});
		act(() => {
			aiMoveHandler("e7e5");
		});

		expect(getByTestId("white-clock").classList.contains("active")).toBe(
			true,
		);

		// Advance time so White runs out of time (approx 605 seconds)
		act(() => {
			vi.advanceTimersByTime(605000);
		});

		// Notification displayed
		expect(notification).toHaveBeenCalledWith(
			"GAME OVER!",
			"White ran out of time! Black has won the game.",
			"danger",
		);
		expect(setGameOverMock).toHaveBeenCalledWith(true);

		// White clock at 00:00 and activeSide is null
		expect(getByTestId("white-clock-time").textContent).toBe("00:00");
		expect(getByTestId("white-clock").classList.contains("active")).toBe(
			false,
		);
		expect(getByTestId("black-clock").classList.contains("active")).toBe(
			false,
		);

		// Attempt to make another move after White timeout
		act(() => {
			aiMoveHandler("g1f3");
		});

		// White clock must NOT get increment and Black clock must NOT start
		expect(getByTestId("white-clock-time").textContent).toBe("00:00");
		expect(getByTestId("white-clock").classList.contains("active")).toBe(
			false,
		);
		expect(getByTestId("black-clock").classList.contains("active")).toBe(
			false,
		);

		vi.useRealTimers();
	});

	test("timer countdown and timeout detection work", () => {
		const notification = vi.fn();
		const setGameOver = vi.fn();

		const { getByTestId } = render(
			<ChessClock
				whiteTime={0}
				blackTime={300}
				activeSide="w"
				maxTimeMinutes={5}
				onMaxTimeMinutesChange={() => {}}
				isConfigurable={false}
			/>,
		);

		expect(getByTestId("white-clock-time").textContent).toBe("00:00");
	});
});
