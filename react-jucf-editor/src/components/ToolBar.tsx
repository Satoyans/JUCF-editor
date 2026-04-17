import { formElementsVariableTypes } from "../formElementTypes";
import { themeColors } from "./themeColor";
import { useAppContext } from "../AppContext";

function createFormElement(): formElementsVariableTypes.elementPropertiesTypes.all {
	return {
		h: "30",
		w: "30",
		x: "0",
		y: "0",
		text: "text",
		texture: "",
		command: "",
		hover_text: "",
		aux: "0",
		is_show_button: "false",
		is_show_close: "false",
		is_show_image: "false",
		is_show_item: "false",
		is_show_text: "true",
	};
}

//ツールバー
export const ToolBar: React.FC = () => {
	const {
		formElements,
		setFormElements,
		targetFormElementIndex,
		setTargetFormElementIndex,
		selectedTab,
		setSelectedTab,
		themeColor,
		setIsDontRecode,
		isDontRecode,
		setStatePastRecoder,
		statePastRecoder,
		setStateFutureRecoder,
		stateFutureRecoder,
	} = useAppContext();

	const tabDivStyle = { width: "100px", marginTop: "10px", border: "solid 1px ", borderBottom: "none", borderRadius: "5px 5px 0 0" };
	const tabPStyle = { textAlign: "center", marginTop: "10px", pointerEvents: "none", userSelect: "none" } as const;
	
	function changeTab(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		const id = (e.target as HTMLDivElement).id;
		const tabName = id.replace("toolbar_tab_", "");
		if (tabName !== "screen" && tabName !== "image" && tabName !== "variable") return;
		if (tabName === selectedTab) return;
		setSelectedTab(tabName);
	}
	
	function disabledTabStyle(tab: "screen" | "image" | "variable") {
		return { backgroundColor: selectedTab === tab ? themeColors[themeColor].tool_bar.tab.disable : "" };
	}

	let buttons = <></>;
	if (selectedTab === "screen") {
		buttons = (
			<div id="toolbar_buttons" style={{ margin: "0 0 0 10px", display: "flex", flexGrow: 1, width: "300px", height: "100%" }}>
				{/* <p style={{ margin: 0, fontSize: 24 }}>toolbar</p> */}
				<div style={{ margin: "5px 0 5px 0" }}>
					<button
						style={{ width: "60px", height: "40px", margin: "0 2px" }}
						onClick={() => {
							const formElementsCopy = JSON.parse(JSON.stringify(formElements));
							formElementsCopy.push(createFormElement());
							setFormElements(formElementsCopy);
							setTargetFormElementIndex(formElementsCopy.length - 1);
						}}
					>
						追加
					</button>
					<button
						style={{ width: "60px", height: "40px", margin: "0 2px" }}
						onClick={() => {
							const index = targetFormElementIndex;
							if (index === null) return;
							const formElementsCopy = JSON.parse(JSON.stringify(formElements));
							formElementsCopy.splice(index, 1);
							setTargetFormElementIndex(null);
							setFormElements(formElementsCopy);
						}}
					>
						削除
					</button>
					<button
						style={{ width: "60px", height: "40px", margin: "0 2px" }}
						onClick={() => {
							const index = targetFormElementIndex;
							if (index === null) return;
							const formElementsCopy = JSON.parse(JSON.stringify(formElements));
							formElementsCopy.push(formElementsCopy[index]);
							setTargetFormElementIndex(formElementsCopy.length - 1);
							setFormElements(formElementsCopy);
						}}
					>
						コピー
					</button>
				</div>
				<div style={{ margin: "5px 0 5px 10px" }}>
					<button
						style={{ width: "60px", height: "40px", margin: "0 2px" }}
						onClick={() => {
							if (statePastRecoder.length === 0) return;
							const statePastRecoderCopy = [...statePastRecoder];
							console.log(statePastRecoderCopy);
							const nowRecoder = statePastRecoderCopy.splice(statePastRecoder.length - 1, 1);
							const recoder = statePastRecoderCopy[statePastRecoderCopy.length - 1];
							setFormElements([...(recoder !== undefined ? recoder.elements : []).map((e) => ({ ...e }))]);
							setTargetFormElementIndex(recoder !== undefined ? recoder.index : null);
							setStatePastRecoder(statePastRecoderCopy);
							setStateFutureRecoder([nowRecoder[0], ...stateFutureRecoder]);
							setIsDontRecode(true);
						}}
					>
						undo
					</button>
					<button
						style={{ width: "60px", height: "40px", margin: "0 2px" }}
						onClick={() => {
							if (stateFutureRecoder.length === 0) return;
							const stateFutureRecoderCopy = [...stateFutureRecoder];
							const nowRecoder = stateFutureRecoderCopy.splice(0, 1);
							setFormElements([...nowRecoder[0].elements.map((e) => ({ ...e }))]);
							setTargetFormElementIndex(nowRecoder[0].index);
							setStateFutureRecoder(stateFutureRecoderCopy);
							setStatePastRecoder([...statePastRecoder, nowRecoder[0]]);
							setIsDontRecode(true);
						}}
					>
						redo
					</button>
				</div>
			</div>
		);
	}

	return (
		<div id="toolbar" style={{ width: "100%", height: `${50 - 1}px`, margin: 0, boxShadow: "0 -1px 0 0 black inset", display: "flex" }}>
			{buttons}
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
