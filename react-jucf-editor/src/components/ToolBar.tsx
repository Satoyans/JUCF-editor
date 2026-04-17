import { themeColors } from "./themeColor";
import { useAppContext } from "../AppContext";

//ツールバー
export const ToolBar: React.FC = () => {
	const { selectedTab, setSelectedTab, themeColor } = useAppContext();

	const tabDivStyle = { width: "100px", marginTop: "10px", border: "solid 1px ", borderBottom: "none", borderRadius: "5px 5px 0 0" };
	const tabPStyle = { textAlign: "center", marginTop: "10px", pointerEvents: "none", userSelect: "none" } as const;
	
	function changeTab(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		const id = (e.currentTarget as HTMLButtonElement).id;
		const tabName = id.replace("toolbar_tab_", "");
		if (tabName !== "screen" && tabName !== "image" && tabName !== "variable") return;
		if (tabName === selectedTab) return;
		setSelectedTab(tabName);
	}
	
	function disabledTabStyle(tab: "screen" | "image" | "variable") {
		return { backgroundColor: selectedTab === tab ? themeColors[themeColor].tool_bar.tab.disable : "" };
	}

	return (
		<div id="toolbar" style={{ width: "100%", height: "49px", margin: 0, boxShadow: "0 -1px 0 0 black inset", display: "flex" }}>
			<div id="toolbar_tabs" style={{ display: "flex", flexGrow: 1, justifyContent: "flex-end" }}>
				<button id="toolbar_tab_screen" style={{ ...tabDivStyle, ...disabledTabStyle("screen") }} onClick={changeTab}>
					<p style={{ ...tabPStyle }}>スクリーン</p>
				</button>
				<button id="toolbar_tab_image" style={{ ...tabDivStyle, ...disabledTabStyle("image") }} onClick={changeTab}>
					<p style={{ ...tabPStyle }}>画像</p>
				</button>
				<button id="toolbar_tab_variable" style={{ ...tabDivStyle, ...disabledTabStyle("variable") }} onClick={changeTab}>
					<p style={{ ...tabPStyle }}>変数</p>
				</button>
			</div>
		</div>
	);
};
