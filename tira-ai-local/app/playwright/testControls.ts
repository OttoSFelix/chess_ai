import { test, expect, _electron as electron } from "playwright/test";
import { resetAll } from "../src/renderer/UserData";

test.afterEach(async () => {
	resetAll();
});

test("Undoing and redoing move works", async () => {
	const electronApp = await electron.launch({
		args: [
			"./out/tira-ai-local-linux-x64/resources/app/.webpack/main/index.js",
		],
		timeout: 60000,
	});
	const window = await electronApp.firstWindow();
	window.getByText("Chess").click();
	await window.locator("#file-text-input").fill("/");
	await window.locator("#feninput").fill("");
	await window.locator("#submit").click();

	await window.locator("#auto-send-toggle").click();

	//const img = await window.locator(".kokopu-chessboard").locator("image")
	const img = await window.locator(
		".kokopu-chessboard image[x='420'][y='360']",
	);

	const rect = await window.locator(
		".kokopu-chessboard rect[x='420'][y='240']",
	);

	await img.dragTo(rect, { force: true });

	await window.getByText("Copy current FEN").click();
	let handle = await electronApp.evaluateHandle((on) =>
		on.clipboard.readText(),
	);
	let clipboard = await handle.jsonValue();

	expect(clipboard).toBe(
		"rnbqkbnr/pppppppp/8/8/8/7P/PPPPPPP1/RNBQKBNR b KQkq - 0 1",
	);

	await window.getByTestId("prev-move-button").click();

	await window.getByText("Copy current FEN").click();
	handle = await electronApp.evaluateHandle((on) => on.clipboard.readText());
	clipboard = await handle.jsonValue();

	expect(clipboard).toBe(
		"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
	);

	await window.getByTestId("next-move-button").click();

	await window.getByText("Copy current FEN").click();
	handle = await electronApp.evaluateHandle((on) => on.clipboard.readText());
	clipboard = await handle.jsonValue();

	expect(clipboard).toBe(
		"rnbqkbnr/pppppppp/8/8/8/7P/PPPPPPP1/RNBQKBNR b KQkq - 0 1",
	);

	await electronApp.close();
});
