import { formElementsTypes } from "../formElementTypes";

function createFormElement(): formElementsTypes.elementPropertiesTypes.all {
	return { h: 30, w: 30, x: 0, y: 0, text: "element", texture: "", hover_text: "", is_show_button: false, is_show_close: false, is_show_image: false, is_show_text: true };
}
//ツールバー
export const ToolBar: React.FC<{
	props: {
		formElements: formElementsTypes.elementPropertiesTypes.all[];
		setFormElements: React.Dispatch<React.SetStateAction<formElementsTypes.elementPropertiesTypes.all[]>>;
		targetFormElementIndex: number | null;
		setTargetFormElementIndex: React.Dispatch<React.SetStateAction<number | null>>;
	};
}> = ({ props }) => {
	const tab_div_style = { width: "100px", marginTop: "10px", border: "solid 1px ", borderBottom: "none", borderRadius: "5px 5px 0 0" };
	const tab_p_style = { textAlign: "center", marginTop: "10px", pointerEvents: "none", userSelect: "none" } as const;
	return (
		<div id="toolbar" style={{ width: "100%", height: `${50 - 1}px`, margin: 0, boxShadow: "0 -1px 0 0 black inset", display: "flex", justifyContent: "space-between" }}>
			<div id="toolbar_buttons" style={{ margin: "0 0 0 10px", display: "flex" }}>
				{/* <p style={{ margin: 0, fontSize: 24 }}>toolbar</p> */}
				<button
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
			<div id="toolbar_tabs" style={{ display: "flex", justifyContent: "space-between" }}>
				<div style={{ ...tab_div_style }} id="toolbar_tab1">
					<p style={{ ...tab_p_style }}>スクリーン</p>
				</div>
				<div style={{ ...tab_div_style }} id="toolbar_tab2">
					<p style={{ ...tab_p_style }}>画像</p>
				</div>
				<div style={{ ...tab_div_style }} id="toolbar_tab3">
					<p style={{ ...tab_p_style }}>変数</p>
				</div>
			</div>
		</div>
	);
};
