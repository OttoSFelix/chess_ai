import { defineConfig } from "playwright/test";

export default defineConfig({
	testMatch: "*playwright/**/*.ts",
	workers: 1,
});
