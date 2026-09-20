// @vitest-environment jsdom

import { test, describe, expect } from "vitest";
import { createPGNString } from "../../renderer/PGNFormatter";
import { Position } from "kokopu";

describe("PGN Formatter", () => {
	test("returns default PGN string when given empty list", () => {
		const pgnstring = createPGNString([]);
		const expected =
			'[Round "?"]\n[White "?"]\n[Black "?"]\n[Result "*"]\n[FEN "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0"]\n[SetUp "1"]\n\n*\n';
		expect(pgnstring).toMatch(expected);
	});
});
