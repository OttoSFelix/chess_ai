import { test, expect, _electron as electron } from "playwright/test";
import { resetAll } from "../src/renderer/UserData";

test.afterEach(async () => {
	resetAll();
});

test("Chess field form", async () => {
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
	await electronApp.close();
});

test("Connect Four field form", async () => {
	const electronApp = await electron.launch({
		args: [
			"./out/tira-ai-local-linux-x64/resources/app/.webpack/main/index.js",
		],
		timeout: 60000,
	});
	const window = await electronApp.firstWindow();
	window.getByText("Connect Four").click();
	await window.locator("#file-text-input").fill("/");
	await window.locator("#submit").click();
	await electronApp.close();
});

test("launch app", async () => {
	const electronApp = await electron.launch({
		args: [
			"./out/tira-ai-local-linux-x64/resources/app/.webpack/main/index.js",
		],
		timeout: 60000,
	});
	const window = await electronApp.firstWindow({ timeout: 60000 });

	await expect(window.locator("#navigation-bar")).toBeVisible();
	// close app
	await electronApp.close();
	resetAll();
});

test("Changing skins work", async () => {
	resetAll();
	const electronApp = await electron.launch({
		args: [
			"./out/tira-ai-local-linux-x64/resources/app/.webpack/main/index.js",
		],
		timeout: 60000,
	});
	const window = await electronApp.firstWindow({ timeout: 60000 });
	await window.getByTestId("color-button").selectOption("dusk");
	await electronApp.close();
	resetAll();
});
