import { useAppContext } from "../AppContext";
import { themeColors } from "./themeColor";

export const Header: React.FC = () => {
	const { selectedTab, setSelectedTab, themeColor } = useAppContext();
	const headerHeight = 55;

	const tabDivStyle: React.CSSProperties = { 
		width: "110px", 
		height: "38px", 
		marginLeft: "6px", 
		borderRadius: "8px 8px 0 0", 
		cursor: "pointer", 
		alignSelf: "flex-end",
		transition: "background-color 0.2s, color 0.2s"
	};
	const tabPStyle: React.CSSProperties = { textAlign: "center", margin: "0", pointerEvents: "none", userSelect: "none", lineHeight: "38px" };

	function changeTab(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		const id = (e.currentTarget as HTMLButtonElement).id;
		const tabName = id.replace("toolbar_tab_", "");
		if (tabName !== "screen" && tabName !== "image" && tabName !== "variable") return;
		if (tabName === selectedTab) return;
		setSelectedTab(tabName);
	}

	function getTabStyle(tab: "screen" | "image" | "variable"): React.CSSProperties {
		const isSelected = selectedTab === tab;
		return {
			...tabDivStyle,
			backgroundColor: isSelected ? "#ffffff" : "#e5e7eb", // 選択時白、未選択時グレー
			color: isSelected ? "#111827" : "#6b7280", // 選択時濃いグレー、未選択時グレーテキスト
			fontWeight: isSelected ? "bold" : "normal",
			border: "1px solid #d1d5db",
			borderTop: "1px solid #d1d5db",
			borderBottom: isSelected ? "1px solid #ffffff" : "1px solid #d1d5db",
			marginBottom: isSelected ? "-1px" : "0", // ヘッダーの下線を上書きして一体感を出す
			zIndex: isSelected ? 10 : 1,
			boxShadow: isSelected ? "0 -2px 10px rgba(0,0,0,0.05)" : "none", // 浮いている感
			position: "relative" // zIndex用
		};
	}

	return (
		<div id="header" style={{ width: "100%", height: `${headerHeight}px`, margin: 0, borderBottom: "1px solid #d1d5db", backgroundColor: "#f9fafb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
			<div style={{ display: "flex", alignItems: "center", height: "100%", paddingLeft: "15px" }}>
				<p style={{ margin: 0, fontSize: 30, fontWeight: "bold", color: "#111827" }}>JUCF-editor</p>
				{/* Githubアイコンをタイトルの直後に配置 */}
				<img
					style={{ height: "30px", width: "30px", marginLeft: "15px", cursor: "pointer" }}
					src="./img/github_icon.png"
					alt="github_icon"
					title="Github Repository"
					onClick={() => window.open("https://github.com/Satoyans/JUCF_editor")}
				/>
			</div>

			<div id="toolbar_tabs" style={{ display: "flex", height: "100%", alignItems: "flex-end", paddingRight: "10px" }}>
				<button id="toolbar_tab_screen" style={getTabStyle("screen")} onClick={changeTab}>
					<p style={tabPStyle}>スクリーン</p>
				</button>
				<button id="toolbar_tab_image" style={getTabStyle("image")} onClick={changeTab}>
					<p style={tabPStyle}>画像</p>
				</button>
				<button id="toolbar_tab_variable" style={getTabStyle("variable")} onClick={changeTab}>
					<p style={tabPStyle}>変数</p>
				</button>
			</div>
		</div>
	);
};
