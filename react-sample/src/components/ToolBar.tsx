import { formElementsTypes, formElementsVariableTypes } from "../formElementTypes";
import { themeColors } from "./themeColor";

function createFormElement(): formElementsVariableTypes.elementPropertiesTypes.all {
	return {
		h: "30",
		w: "30",
		x: "0",
		y: "0",
		text: "element",
		texture: "",
		hover_text: "",
		is_show_button: "false",
		is_show_close: "false",
		is_show_image: "false",
		is_show_text: "true",
	};
}
//ツールバー
export const ToolBar: React.FC<{
	props: {
		formElements: formElementsVariableTypes.elementPropertiesTypes.all[];
		setFormElements: React.Dispatch<React.SetStateAction<formElementsVariableTypes.elementPropertiesTypes.all[]>>;
		targetFormElementIndex: number | null;
		setTargetFormElementIndex: React.Dispatch<React.SetStateAction<number | null>>;
		selectedTab: "screen" | "image" | "variable";
		setSelectedTab: React.Dispatch<React.SetStateAction<"screen" | "image" | "variable">>;
		themeColor: "Light" | "Dark";
	};
}> = ({ props }) => {
	const tab_div_style = { width: "100px", marginTop: "10px", border: "solid 1px ", borderBottom: "none", borderRadius: "5px 5px 0 0" };
	const tab_p_style = { textAlign: "center", marginTop: "10px", pointerEvents: "none", userSelect: "none" } as const;
	function changeTab(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		const id = (e.target as HTMLDivElement).id;
		const tab_name = id.replace("toolbar_tab_", "");
		if (tab_name !== "screen" && tab_name !== "image" && tab_name !== "variable") return;
		if (tab_name === props.selectedTab) return;
		props.setSelectedTab(tab_name);
	}
	function disabledTabStyle(tab: "screen" | "image" | "variable") {
		return { backgroundColor: props.selectedTab === tab ? themeColors[props.themeColor].tool_bar.tab.disable : "" };
	}

	let buttons = <></>;
	if (props.selectedTab === "screen") {
		buttons = (
			<div id="toolbar_buttons" style={{ margin: "0 0 0 10px", display: "flex", flexGrow: 1, width: "300px" }}>
				{/* <p style={{ margin: 0, fontSize: 24 }}>toolbar</p> */}
				<button
					style={{ width: "60px", margin: "0 5px" }}
					onClick={() => {
						const form_elements = JSON.parse(JSON.stringify(props.formElements));
						form_elements.push(createFormElement());
						props.setFormElements(form_elements);
						props.setTargetFormElementIndex(form_elements.length - 1);
					}}
				>
					add
				</button>
				<button
					style={{ width: "60px", margin: "0 5px" }}
					onClick={() => {
						const index = props.targetFormElementIndex;
						if (index === null) return;
						const form_elements = JSON.parse(JSON.stringify(props.formElements));
						form_elements.splice(index, 1);
						props.setTargetFormElementIndex(null);
						props.setFormElements(form_elements);
					}}
				>
					remove
				</button>
				<button
					style={{ width: "60px", margin: "0 5px" }}
					onClick={() => {
						const index = props.targetFormElementIndex;
						if (index === null) return;
						const form_elements = JSON.parse(JSON.stringify(props.formElements));
						form_elements.push(form_elements[index]);
						props.setTargetFormElementIndex(form_elements.length - 1);
						props.setFormElements(form_elements);
					}}
				>
					copy
				</button>
			</div>
		);
	}

	return (
		<div id="toolbar" style={{ width: "100%", height: `${50 - 1}px`, margin: 0, boxShadow: "0 -1px 0 0 black inset", display: "flex" }}>
			{buttons}
			<div id="toolbar_tabs" style={{ display: "flex", flexGrow: 1, justifyContent: "flex-end" }}>
				<button id="toolbar_tab_screen" style={{ ...tab_div_style, ...disabledTabStyle("screen") }} onClick={changeTab}>
					<p style={{ ...tab_p_style }}>スクリーン</p>
				</button>
				<button id="toolbar_tab_image" style={{ ...tab_div_style, ...disabledTabStyle("image") }} onClick={changeTab}>
					<p style={{ ...tab_p_style }}>画像</p>
				</button>
				<button id="toolbar_tab_variable" style={{ ...tab_div_style, ...disabledTabStyle("variable") }} onClick={changeTab}>
					<p style={{ ...tab_p_style }}>変数</p>
				</button>
			</div>
		</div>
	);
};
