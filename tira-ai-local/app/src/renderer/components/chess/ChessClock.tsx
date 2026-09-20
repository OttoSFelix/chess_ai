import React from "react";
import "../../css/ChessClock.css";

export interface ChessClockProps {
	whiteTime: number;
	blackTime: number;
	activeSide: "w" | "b" | null;
	maxTimeMinutes: number;
	onMaxTimeMinutesChange: (minutes: number) => void;
	isConfigurable: boolean;
	onReset?: () => void;
	children?: React.ReactNode;
}

/**
 * Formats time in seconds to MM:SS or H:MM:SS format using Math.ceil.
 *
 * @param {number} totalSeconds - Time remaining in seconds
 * @returns {string} - Formatted time string
 */
export function formatTime(totalSeconds: number): string {
	const clamped = Math.max(0, Math.ceil(totalSeconds));
	const hours = Math.floor(clamped / 3600);
	const mins = Math.floor((clamped % 3600) / 60);
	const secs = clamped % 60;
	if (hours > 0) {
		return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	}
	return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export const ChessClock: React.FC<ChessClockProps> = ({
	whiteTime,
	blackTime,
	activeSide,
	maxTimeMinutes,
	onMaxTimeMinutesChange,
	isConfigurable,
	onReset,
	children,
}) => {
	const isBlackActive = activeSide === "b";
	const isWhiteActive = activeSide === "w";

	const isBlackLowTime = blackTime <= 30 && blackTime > 0;
	const isWhiteLowTime = whiteTime <= 30 && whiteTime > 0;

	const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = parseInt(e.target.value, 10);
		if (!isNaN(val) && val > 0) {
			onMaxTimeMinutesChange(val);
		}
	};

	return (
		<div className="chess-clock-wrapper" data-testid="chess-clock-wrapper">
			<div
				className={`chess-clock-bar black-clock ${isBlackActive ? "active" : ""} ${isBlackLowTime ? "low-time" : ""}`}
				data-testid="black-clock"
			>
				<div className="chess-clock-player">
					<span className="chess-clock-icon" aria-hidden="true">
						♚
					</span>
					<span>Black</span>
					{isBlackActive && (
						<span className="chess-clock-badge">Turn</span>
					)}
				</div>
				<div
					className="chess-clock-time"
					data-testid="black-clock-time"
				>
					{formatTime(blackTime)}
				</div>
			</div>

			{children}

			<div
				className={`chess-clock-bar white-clock ${isWhiteActive ? "active" : ""} ${isWhiteLowTime ? "low-time" : ""}`}
				data-testid="white-clock"
			>
				<div className="chess-clock-player">
					<span className="chess-clock-icon" aria-hidden="true">
						♔
					</span>
					<span>White</span>
					{isWhiteActive && (
						<span className="chess-clock-badge">Turn</span>
					)}
				</div>
				<div
					className="chess-clock-time"
					data-testid="white-clock-time"
				>
					{formatTime(whiteTime)}
				</div>
			</div>

			<div className="chess-clock-controls">
				<div className="chess-clock-config">
					<label htmlFor="chess-clock-time-input">Time (min):</label>
					<input
						id="chess-clock-time-input"
						data-testid="chess-clock-time-input"
						type="number"
						min="1"
						max="180"
						className="chess-clock-input"
						value={maxTimeMinutes}
						onChange={handleTimeInputChange}
						disabled={!isConfigurable}
						title={
							isConfigurable
								? "Set the maximum time each player gets in minutes"
								: "Reset the board to configure a new time limit"
						}
					/>
				</div>
				{onReset && (
					<button
						type="button"
						className="chess-clock-reset-btn"
						data-testid="chess-clock-reset-btn"
						onClick={onReset}
						title="Reset the board and chess clock"
					>
						Reset Board
					</button>
				)}
			</div>
		</div>
	);
};
