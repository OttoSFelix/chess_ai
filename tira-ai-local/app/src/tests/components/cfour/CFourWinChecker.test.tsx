// @vitest-environment jsdom

import { test, describe, expect } from "vitest";
import checkForWin from "../../../renderer/components/cfour/CFourWinChecker";

describe("CFourWinChecker", () => {
	test("empty board", () => {
		const boardmatrix: number[][] = [
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0],
		];
		const isGameOver = checkForWin(boardmatrix);
		expect(isGameOver).toBe(false);
	});
	test("win horizontal", () => {
		const boardmatrix: number[][] = [
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 2],
			[0, 0, 0, 0, 0, 1],
			[0, 0, 0, 0, 0, 1],
			[0, 0, 0, 0, 0, 1],
			[0, 0, 0, 0, 2, 1],
			[0, 0, 0, 0, 0, 2],
		];
		const isGameOver = checkForWin(boardmatrix);
		expect(isGameOver).toBe(true);
	});
	test("win vertical", () => {
		const boardmatrix: number[][] = [
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0],
			[0, 0, 1, 1, 1, 1],
			[0, 0, 0, 2, 2, 2],
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0],
		];
		const isGameOver = checkForWin(boardmatrix);
		expect(isGameOver).toBe(true);
	});
	test("win diagonal", () => {
		const boardmatrix: number[][] = [
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0],
			[0, 0, 2, 1, 1, 2],
			[0, 0, 0, 2, 1, 1],
			[0, 0, 0, 0, 2, 1],
			[0, 0, 0, 0, 0, 2],
			[0, 0, 0, 0, 0, 0],
		];
		const isGameOver = checkForWin(boardmatrix);
		expect(isGameOver).toBe(true);
	});
	test("win diagonal 2", () => {
		const boardmatrix: number[][] = [
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 1],
			[0, 0, 0, 0, 1, 2],
			[0, 0, 0, 1, 2, 1],
			[0, 0, 1, 2, 2, 2],
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0],
		];
		const isGameOver = checkForWin(boardmatrix);
		expect(isGameOver).toBe(true);
	});
	test("only 3 in row", () => {
		const boardmatrix: number[][] = [
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 1],
			[0, 0, 0, 0, 0, 1],
			[0, 0, 0, 0, 2, 1],
			[0, 0, 0, 0, 0, 2],
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0],
		];
		const isGameOver = checkForWin(boardmatrix);
		expect(isGameOver).toBe(false);
	});
	test("horizontal win in corner", () => {
		const boardmatrix: number[][] = [
			[2, 1, 2, 1, 2, 1],
			[2, 1, 2, 1, 2, 2],
			[2, 2, 1, 1, 2, 2],
			[2, 1, 1, 2, 1, 1],
			[1, 2, 2, 1, 2, 2],
			[1, 1, 2, 1, 1, 1],
			[2, 1, 1, 2, 2, 2],
		];
		const isGameOver = checkForWin(boardmatrix);
		expect(isGameOver).toBe(true);
	});
	test("vertical win in corner", () => {
		const boardmatrix: number[][] = [
			[2, 1, 2, 1, 2, 1],
			[2, 1, 2, 1, 2, 2],
			[1, 2, 1, 1, 2, 2],
			[2, 1, 1, 2, 1, 1],
			[0, 0, 1, 1, 2, 2],
			[0, 2, 2, 2, 1, 1],
			[1, 1, 1, 1, 2, 2],
		];
		const isGameOver = checkForWin(boardmatrix);
		expect(isGameOver).toBe(true);
	});
	test("diagonal win in corner 1", () => {
		const boardmatrix: number[][] = [
			[2, 1, 2, 1, 2, 1],
			[2, 1, 2, 1, 2, 2],
			[1, 2, 1, 2, 2, 2],
			[2, 1, 2, 1, 1, 1],
			[2, 1, 1, 1, 2, 2],
			[2, 1, 2, 2, 1, 1],
			[1, 2, 1, 1, 2, 2],
		];
		const isGameOver = checkForWin(boardmatrix);
		expect(isGameOver).toBe(true);
	});
	test("diagonal win in corner 2", () => {
		const boardmatrix: number[][] = [
			[2, 1, 2, 2, 2, 1],
			[2, 1, 2, 1, 2, 2],
			[1, 2, 1, 2, 2, 2],
			[2, 1, 1, 2, 1, 1],
			[1, 2, 1, 1, 2, 2],
			[2, 1, 2, 2, 1, 1],
			[1, 2, 1, 1, 2, 2],
		];
		const isGameOver = checkForWin(boardmatrix);
		expect(isGameOver).toBe(true);
	});
	test("only 3 in row more", () => {
		const boardmatrix: number[][] = [
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 1, 1, 1],
			[0, 0, 0, 0, 1, 1],
			[0, 0, 0, 1, 2, 1],
			[0, 0, 0, 2, 1, 2],
			[0, 0, 0, 0, 2, 2],
			[0, 0, 0, 2, 2, 2],
		];
		const isGameOver = checkForWin(boardmatrix);
		expect(isGameOver).toBe(false);
	});
});
