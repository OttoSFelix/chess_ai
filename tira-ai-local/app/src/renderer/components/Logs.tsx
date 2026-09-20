import React, { useState, useEffect, useRef } from "react";
import socket from "../MySocket";
import "../css/Logs.css";
/**
 * This is a log box for displaying what happens to the AI and what it prints out
 *
 * @returns {JSX.Element} - React component representing the log box
 */
export function Logs() {
	const [logs, setLogs] = useState([]);
	const textareaRef = useRef(null);

	function handleNewLogs(newLog) {
		const timestamp = new Date().toLocaleTimeString();
		setLogs((prevLogs) => [
			...prevLogs,
			`${timestamp} | ${newLog}\n--------------------------------------------------------`,
		]);
	}

	useEffect(() => {
		socket.on("logs", (log) => {
			handleNewLogs(log);
		});

		if (textareaRef.current) {
			textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
		}

		return () => {
			socket.off("logs");
		};
	}, [logs]);

	return (
		<div id="log-box">
			<textarea ref={textareaRef} value={logs.join("\n")} readOnly />
		</div>
	);
}
