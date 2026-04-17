export const themeColors: {
	[theme: string]: {
		screen: { gameArea: string; formArea: string };
		element_panel: { background: string };
		control_panel: { background: string };
		tool_bar: { tab: { disable: string } };
		image_panel: { background: string };
		dropzone: { background: string };
		variable_panel: { background: string };
	};
} = {
	Light: {
		screen: { gameArea: "#e5e7eb", formArea: "#ffffff" },
		element_panel: { background: "#ffffff" },
		control_panel: { background: "#ffffff" },
		tool_bar: { tab: { disable: "#e5e7eb" } },
		image_panel: { background: "#ffffff" },
		dropzone: { background: "#f3f4f6" },
		variable_panel: { background: "#ffffff" },
	},
	Dark: {
		screen: { gameArea: "#27272a", formArea: "#3f3f46" },
		element_panel: { background: "#1e1e20" },
		control_panel: { background: "#1e1e20" },
		tool_bar: { tab: { disable: "#27272a" } },
		image_panel: { background: "#1e1e20" },
		dropzone: { background: "#27272a" },
		variable_panel: { background: "#1e1e20" },
	},
};
