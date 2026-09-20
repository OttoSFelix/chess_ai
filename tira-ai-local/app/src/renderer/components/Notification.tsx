import React, { useState, useEffect } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

interface NotificationProps {
	show: boolean;
	onClose: () => void;
	headerText?: string;
	bodyText?: string;
	bg?: string;
	consoleLog?: boolean;
}

/**
 * Represents a notification toast for displaying messages.
 *
 * @param {object} props - Component props
 * @param {boolean} props.show - Flag indicating if the notification should be shown
 * @param {Function} props.onClose - Function to handle notification close
 * @param {string} [props.headerText=""] - Text for the notification header
 * @param {string} [props.bodyText=""] - Text for the notification body
 * @param {string} [props.bg=""] - Background color of the notification
 * @param {boolean} [props.consoleLog=true] - Flag indicating if the notification should be logged in console
 *
 * @returns {JSX.Element} - React component representing the notification toast
 */
export function Notification({
	show,
	onClose,
	headerText = "",
	bodyText = "",
	bg = "",
	consoleLog = true,
}: NotificationProps) {
	const [prevHeaderText, setPrevHeaderText] = useState<string>("");
	const [prevBodyText, setPrevBodyText] = useState<string>("");

	useEffect(() => {
		if (headerText !== prevHeaderText || bodyText !== prevBodyText) {
			if (consoleLog) {
				if (bg.toLowerCase() === "danger") {
					console.error(`${headerText}\n${bodyText}`);
				} else {
					console.log(`${headerText}\n${bodyText}`);
				}
			}
			setPrevHeaderText(headerText);
			setPrevBodyText(bodyText);
		}
	}, [headerText, bodyText, bg, consoleLog, prevHeaderText, prevBodyText]);

	return (
		<ToastContainer position={"top-center"}>
			<Toast
				show={show}
				onClose={onClose}
				bg={bg}
				autohide={true}
				delay={10000}
			>
				{headerText && (
					<Toast.Header>
						<strong className="me-auto" id="notification">
							{headerText}
						</strong>
					</Toast.Header>
				)}
				{bodyText && (
					<Toast.Body id="notification">
						<div style={{ maxHeight: "200px", overflowY: "auto" }}>
							{bodyText}
						</div>
					</Toast.Body>
				)}
			</Toast>
		</ToastContainer>
	);
}
