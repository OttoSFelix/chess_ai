import Store from "electron-store";

type DataType = {
	game: string;
	ai_path: string;
	piece_set: string;
	color_set: string;
	arrow: string;
};

const schema = {
	game: {
		type: "string",
		default: "chess",
	},
	ai_path: {
		type: "string",
		default: "",
	},
	piece_set: {
		type: "string",
		default: "cburnett",
	},
	color_set: {
		type: "string",
		default: "original",
	},
	arrow: {
		type: "string",
		default: "G",
	},
} as const;

const store = new Store({ schema: schema });

/**
 * Set data in the electron store with the specified key.
 *
 * @param {keyof DataType} key - The key for the data to be set
 * @param {string} data - The data to be set
 */
export function setData(key: keyof DataType, data: string) {
	store.set(key, data);
}

/**
 * Get data from the electron store with the specified key.
 *
 * @param {keyof DataType} key - The key for the data to be retrieved
 * @returns {string} - The retrieved data
 */
export function getData(key: keyof DataType): string {
	return store.get(key).toString();
}

/**
 * Reset the data in the electron store with the specified key.
 *
 * @param {keyof DataType} key - The key for the data to be reset
 */
export function resetData(key: keyof DataType) {
	store.reset(key);
}

/**
 * Reset all data in the electron store.
 */
export function resetAll() {
	store.clear();
}
