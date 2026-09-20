import React, { useState } from "react";
import "../css/Buttons.css";
import path from "path";
import "../css/AIForm.css";
import { setData, getData } from "../UserData";

interface AIFormProps {
	handleSubmit: (
		filepath: string,
		fennotation: string,
		runSetup: boolean,
	) => void;
	showFen: boolean;
	formId: string;
}
/**
 * Represents a form for submitting AI files and configurations.
 *
 * @param {object} props - Component props
 * @param {Function} props.handleSubmit - Function to handle form submission
 * @param {boolean} props.showFen - Flag indicating if the FEN input field should be shown
 * @param {string} props.formId - ID of the form
 *
 * @returns {JSX.Element} - React component representing the AI submission form
 */
function AIForm(props: AIFormProps): JSX.Element {
	const [filepath, setFilePath] = useState(getData("ai_path"));
	const [fennotation, setFenNotation] = useState("");
	const [runSetup, setRunSetup] = useState(false);
	const [dragging, setDragging] = useState(false);

	function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
		e.preventDefault();
		props.handleSubmit(filepath, fennotation, runSetup);
		setData("ai_path", filepath);
	}

	function handleDrop(e: React.DragEvent<HTMLDivElement>): void {
		e.preventDefault();
		setDragging(false);
		const files = e.dataTransfer.files;
		if (files.length > 0) {
			const fpath = files[0].path;
			setFilePath(fpath);
		}
	}

	function handleDragOver(e: React.DragEvent<HTMLDivElement>): void {
		e.preventDefault();
		setDragging(true);
	}

	function handleSelectFolderClick(): void {
		const input = document.createElement("input");
		input.type = "file";
		input.setAttribute("webkitdirectory", "");
		input.setAttribute("directory", "");
		input.setAttribute("multiple", "false");
		input.onchange = (e: any) => {
			const selectedFolder = e.target.files[0];
			if (path.dirname(selectedFolder.path)) {
				setFilePath(path.dirname(selectedFolder.path));
			} else {
				alert("Please select a folder.");
			}
		};
		input.click();
	}

	return (
		<div id="ai-form">
			<form onSubmit={handleSubmit} id={props.formId}>
				<div className="folder-submit">
					<h2>Submit AI: </h2>
					<div
						id="fileinput"
						onClick={handleSelectFolderClick}
						onDrop={handleDrop}
						onDragOver={handleDragOver}
					>
						<div>Click or Drag & Drop Folder Here</div>
					</div>
					<input
						type="text"
						value={filepath}
						onChange={(e) => setFilePath(e.target.value)}
						placeholder="Or type folder path here"
						id="file-text-input"
					/>
				</div>
				{props.showFen && (
					<>
						<br />
						<div>Set FEN: </div>
						<div>
							<input
								id="feninput"
								value={fennotation}
								onChange={(e) => setFenNotation(e.target.value)}
							/>{" "}
							<br />
							<text id="fenextra">
								(empty for starting position)
							</text>
						</div>
					</>
				)}
				<br />
				<div>
					<label htmlFor="run-setup">Run setup</label>
					<input
						type="checkbox"
						id="run-setup"
						onChange={(e) => setRunSetup(e.target.checked)}
						checked={runSetup}
					/>
				</div>
				<br />
				<button type="submit" id="submit" className="classic-button">
					SUBMIT
				</button>
			</form>
		</div>
	);
}

export default AIForm;
