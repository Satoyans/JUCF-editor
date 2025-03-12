import { formElementsTypes, formElementsVariableTypes } from "../formElementTypes";
import { themeColors } from "./themeColor";
import { propsType } from "../propsType";

function createFormElement(): formElementsVariableTypes.elementPropertiesTypes.all {
	return {
		h: "30",
		w: "30",
		x: "0",
		y: "0",
		text: "element",
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
export const ToolBar: React.FC<{
	props: {
		formElements: propsType["formElements"];
		setFormElements: propsType["setFormElements"];
		targetFormElementIndex: propsType["targetFormElementIndex"];
		setTargetFormElementIndex: propsType["setTargetFormElementIndex"];
		selectedTab: propsType["selectedTab"];
		setSelectedTab: propsType["setSelectedTab"];
		themeColor: propsType["themeColor"];
		setIsDontRecode: propsType["setIsDontRecode"];
		isDontRecode: propsType["isDontRecode"];
		setStatePastRecoder: propsType["setStatePastRecoder"];
		statePastRecoder: propsType["statePastRecoder"];
		setStateFutureRecoder: propsType["setStateFutureRecoder"];
		stateFutureRecoder: propsType["stateFutureRecoder"];
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
			<div id="toolbar_buttons" style={{ margin: "0 0 0 10px", display: "flex", flexGrow: 1, width: "300px", height: "100%" }}>
				{/* <p style={{ margin: 0, fontSize: 24 }}>toolbar</p> */}
				<div style={{ margin: "5px 0 5px 0" }}>
					<button
						style={{ width: "60px", height: "40px", margin: "0 2px" }}
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
						style={{ width: "60px", height: "40px", margin: "0 2px" }}
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
						style={{ width: "60px", height: "40px", margin: "0 2px" }}
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
				<div style={{ margin: "5px 0 5px 10px" }}>
					<button
						style={{ width: "60px", height: "40px", margin: "0 2px" }}
						onClick={() => {
							if (props.statePastRecoder.length === 0) return;
							const state_past_recoder_copy = [...props.statePastRecoder];
							console.log(state_past_recoder_copy);
							const now_recoder = state_past_recoder_copy.splice(props.statePastRecoder.length - 1, 1);
							const recoder = state_past_recoder_copy[state_past_recoder_copy.length - 1];
							props.setFormElements([...(recoder !== undefined ? recoder.elements : []).map((e) => ({ ...e }))]);
							props.setTargetFormElementIndex(recoder !== undefined ? recoder.index : null);
							props.setStatePastRecoder(state_past_recoder_copy);
							props.setStateFutureRecoder([now_recoder[0], ...props.stateFutureRecoder]);
							props.setIsDontRecode(true);
						}}
					>
						undo
					</button>
					<button
						style={{ width: "60px", height: "40px", margin: "0 2px" }}
						onClick={() => {
							if (props.stateFutureRecoder.length === 0) return;
							const state_future_recoder_copy = [...props.stateFutureRecoder];
							const now_recoder = state_future_recoder_copy.splice(0, 1);
							props.setFormElements([...now_recoder[0].elements.map((e) => ({ ...e }))]);
							props.setTargetFormElementIndex(now_recoder[0].index);
							props.setStateFutureRecoder(state_future_recoder_copy);
							props.setStatePastRecoder([...props.statePastRecoder, now_recoder[0]]);
							props.setIsDontRecode(true);
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
