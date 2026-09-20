/**
 * Initializes the Electron app, creates a browser window, and spawns a background process.
 * The background process runs a Python script located at "./background-service.pex".
 * Event listeners are set up to handle stdout, stderr, and exit events of the background process.
 * Before the Electron app quits, the background process is terminated.
 */

import { app, BrowserWindow } from "electron";
import { ChildProcess, spawn } from "child_process";
import path from "path";
import Store from "electron-store";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

Store.initRenderer();

let backgroundProcess: ChildProcess | undefined = undefined;

app.on("ready", () => {
	const win = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
		width: 700,
		height: 900,
		autoHideMenuBar: true,
	});

	win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
	win.setMinimumSize(700, 650);

	console.log(__dirname);
	const file = path.join(__dirname, "./background-service.pex");
	console.log("Spawning process");
	backgroundProcess = spawn("python3", [file]);

	backgroundProcess.stdout.on("data", (data) => {
		console.log(data.toString());
	});

	backgroundProcess.stderr.on("data", (data) => {
		console.error(data.toString());
	});

	backgroundProcess.on("exit", (message) => {
		console.log("exit " + message);
	});
});

app.on("before-quit", () => {
	if (backgroundProcess != undefined) {
		backgroundProcess.kill();
	}
});
