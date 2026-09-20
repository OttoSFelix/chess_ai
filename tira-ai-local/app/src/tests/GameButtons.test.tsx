// @vitest-environment jsdom

import { test, describe, expect, vi, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { GameButtons } from "../renderer/components/GameButtons";
import { useState } from "react";
import { Position } from "kokopu";

describe("Game buttons", () => {
	function MockComponent() {
		const [autoSendMove, setAutoSendMove] = useState(false);
		function handleToggle() {
			setAutoSendMove(!autoSendMove);
		}
		function handlePrevMoveButton() {}

		function handleNextMoveButton() {}
		return (
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
		);
	}
	afterEach(cleanup);
	test("Initial state of autoSendMove is true", () => {
		const { getByLabelText } = render(<MockComponent />);
		const checkbox = getByLabelText(
			"Send PLAY after move",
		) as HTMLInputElement;
		expect(!checkbox.checked).toBe(false);
	});
	test("Clicking on checkbox toggles autoSendMove state", () => {
		const { getByLabelText } = render(<MockComponent />);
		const checkbox = getByLabelText(
			"Send PLAY after move",
		) as HTMLInputElement;

		fireEvent.click(checkbox);
		expect(!checkbox.checked).toBe(true);
		fireEvent.click(checkbox);
		expect(!checkbox.checked).toBe(false);
	});
});
