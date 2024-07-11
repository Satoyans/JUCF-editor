export const themeColors: {
	[theme: string]: {
		screen: { gameArea: string; formArea: string };
		element_panel: { background: string };
		control_panel: { background: string };
		tool_bar: { tab: { disable: string } };
		image_panel: { background: string };
		dropzone: { background: string };
	};
} = {
	Light: {
		screen: { gameArea: "#dddddd", formArea: "#fdfdfd" },
		element_panel: { background: "#efefef" },
		control_panel: { background: "#efefef" },
		tool_bar: { tab: { disable: "#b5b5b5" } },
		image_panel: { background: "#eeeeee" },
		dropzone: { background: "#f0f0f0" },
	},
	Dark: {
		screen: { gameArea: "#303030", formArea: "#a1a1a1" },
		element_panel: { background: "#303030" },
		control_panel: { background: "#303030" },
		tool_bar: { tab: { disable: "#b5b5b5" } },
		image_panel: { background: "#eeeeee" },
		dropzone: { background: "dddddd" },
	},
};
