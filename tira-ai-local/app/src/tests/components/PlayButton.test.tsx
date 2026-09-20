// @vitest-environment jsdom

import { test, describe, expect, vi, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";

import { PlayButton } from "../../renderer/components/PlayButton";

describe("Playbutton", () => {
	afterEach(cleanup);

	test("Play button calls sendEmpty", () => {
		const sendEmpty = vi.fn();
		const { getAllByText } = render(
			<PlayButton sendEmpty={sendEmpty} active={true} />,
		);

		const playButton = getAllByText("PLAY!");
		fireEvent.click(playButton[0]);
		expect(sendEmpty).toHaveBeenCalledOnce();
	});
});
