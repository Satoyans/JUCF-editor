import { formElementsTypes } from "../../formElementTypes";
import { propsType } from "../../propsType";
import { variableReplacer } from "../../variableReplacer";
import { themeColors } from "../themeColor";

//コントロールパネル
export const ControlPanel: React.FC<{
	props: propsType;
}> = ({ props }) => {
	const input_style = { width: "30px" };
	let setting_components;
	if (props.targetFormElementIndex === null) {
		//スクリーン自体の設定を表示する
		setting_components = (
			<>
				<div id="control_panel_gamesize">
					<a>game screen size</a>
					<Hint
						title="Minecraftの画面のサイズ&#13;&#10;横幅は470弱でほぼ固定。&#13;&#10;縦幅はPCフルスクリーンで約240&#13;&#10;スマホは機種によるが180前後"
					/>
					<p style={{ margin: 0, fontSize: "12px" }}>
						{props.gameScreenSize.x}px/{props.gameScreenSize.y}px
					</p>
					<div style={{ width: "calc(100% - 20px)" }}>
						<a>x:</a>
						<input
							style={{ width: "calc(100% - 30px)" }}
							value={props.gameScreenSizeVariable.x}
							onChange={(e) => {
								const input_value = e.target.value;
								props.setGameScreenSizeVariable({ x: input_value, y: props.gameScreenSizeVariable.y });
							}}
						/>
					</div>
					<div style={{ width: "calc(100% - 20px)" }}>
						<a>y:</a>
						<input
							style={{ width: "calc(100% - 30px)" }}
							value={props.gameScreenSizeVariable.y}
							onChange={(e) => {
								const input_value = e.target.value;
								props.setGameScreenSizeVariable({ x: props.gameScreenSizeVariable.x, y: input_value });
							}}
						/>
					</div>
				</div>
				<Partition />
				<div id="control_panel_formsize">
					<a>form size</a>
					<Hint
						title="フォームのサイズ&#13;&#10;ゲームスクリーンサイズより大きくなると表示されなかったりタップできなくなったりする。&#13;&#10;横300縦180辺りが無難?"
					/>
					<p style={{ margin: 0, fontSize: "12px" }}>
						{props.formSize.x}px/{props.formSize.y}px
					</p>
					<div style={{ width: "calc(100% - 20px)" }}>
						<a>x:</a>
						<input
							style={{ width: "calc(100% - 30px)" }}
							value={props.formSizeVariable.x}
							onChange={(e) => {
								const input_value = e.target.value;
								props.setFormSizeVariable({ x: input_value, y: props.formSizeVariable.y });
							}}
						/>
					</div>
					<div style={{ width: "calc(100% - 20px)" }}>
						<a>y:</a>
						<input
							style={{ width: "calc(100% - 30px)" }}
							value={props.formSizeVariable.y}
							onChange={(e) => {
								const input_value = e.target.value;
								props.setFormSizeVariable({ x: props.formSizeVariable.x, y: input_value });
							}}
						/>
					</div>
				</div>
				<Partition />
				<div id="control_panel_showformframe">
					<a>showFormFrame</a>
					<Hint
						title="フォームの枠を表示するか&#13;&#10;'true'の場合に表示されます。"
					/>
					<div style={{ width: "calc(100% - 30px)" }}>
						<input
							type="checkbox"
							checked={variableReplacer(props.showFormFrame, props.variable) === "true"}
							onChange={(e) => {
								(e.target as HTMLInputElement).checked = variableReplacer(props.showFormFrame, props.variable) === "true";
							}}
						/>
						<input
							style={{ width: "calc(100% - 30px)" }}
							value={props.showFormFrame}
							onChange={(e) => {
								const input_value = e.target.value;
								props.setShowFormFrame(input_value);
							}}
						/>
					</div>
				</div>
				<Partition />
				<div id="control_panel_formname">
					<a>formName</a>
					<Hint
						title="コマンドで呼び出す際のフォームの名前&#13;&#10;変数は使用できません。"
					/>
					<p style={{ margin: 0, fontSize: "12px" }}>{variableReplacer(props.formName, props.variable)}</p>
					<input
						style={{ width: "calc(100% - 20px)" }}
						value={props.formName}
						onChange={(e) => {
							props.setFormName(e.target.value);
						}}
					/>
				</div>
				{/*TODO フォームの名前とか変数とか*/}
			</>
		);
	} else {
		//その要素の設定を表示する
		const form_element = props.formElements[props.targetFormElementIndex];
		if (form_element === undefined) throw new Error("form element is not found!(control_panel)");

		//変更があった時に良い感じにStateを更新する関数
		const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof formElementsTypes.elementPropertiesTypes.all) => {
			if (props.targetFormElementIndex === null) throw new Error("form element index is null");
			const form_elements: formElementsTypes.elementPropertiesTypes.all[] = JSON.parse(JSON.stringify(props.formElements));
			if (key === "h" || key === "w" || key === "x" || key === "y") {
				const value = Number(e.target.value);
				if (Number.isNaN(value)) return;
				form_element[key] = value;
			} else if (key === "is_show_button" || key === "is_show_close" || key === "is_show_image" || key === "is_show_text") {
				form_element[key] = e.target.checked;
			} else if (key === "label") {
				if (e.target.value === "") {
					delete form_element[key];
				} else {
					form_element[key] = e.target.value;
				}
			} else {
				form_element[key] = e.target.value;
			}
			form_elements[props.targetFormElementIndex] = form_element;
			props.setFormElements(form_elements);
		};
		setting_components = (
			<>
				<div id="control_panel_editmode">
					<a>操作モード:</a>
					<button disabled={props.editMode === "drag"} onClick={(e) => props.setEditMode("drag")}>
						drag
					</button>
					<button disabled={props.editMode === "resize"} onClick={(e) => props.setEditMode("resize")}>
						resize
					</button>
				</div>
				<Partition />
				<div id="control_panel_w">
					<a>w:</a>
					<input style={input_style} value={form_element.w} onChange={(e) => inputOnChange(e, "w")} />
					<a>px</a>
					<Hint
						title="width&#13;&#10;要素の横の大きさ"
					/>
				</div>
				<div id="control_panel_h">
					<a>h:</a>
					<input style={input_style} value={form_element.h} onChange={(e) => inputOnChange(e, "h")} />
					<a>px</a>
					<Hint
						title="height&#13;&#10;要素の縦の大きさ"
					/>
				</div>
				<div id="control_panel_x">
					<a>x:</a>
					<input style={input_style} value={form_element.x} onChange={(e) => inputOnChange(e, "x")} />
					<a>px</a>
					<Hint
						title="フォームの左上が基準の右向きを正とした時の&#13;&#10;要素の左上の点の位置"
					/>
				</div>
				<div id="control_panel_y">
					<a>y:</a>
					<input style={input_style} value={form_element.y} onChange={(e) => inputOnChange(e, "y")} />
					<a>px</a>
					<Hint
						title="フォームの左上が基準の下向きを正とした時の&#13;&#10;要素の左上の点の位置"
					/>
				</div>
				<Partition />
				<div id="control_panel_is_show_text">
					<a>is_show_text:</a>
					<input type="checkbox" checked={form_element.is_show_text} onChange={(e) => inputOnChange(e, "is_show_text")} />
					<Hint title="textで指定した文字を表示するか" />
				</div>
				<div id="control_panel_is_show_image">
					<a>is_show_image:</a>
					<input type="checkbox" checked={form_element.is_show_image} onChange={(e) => inputOnChange(e, "is_show_image")} />
					<Hint title="textureで指定した画像を表示するか" />
				</div>
				<div id="control_panel_is_show_button">
					<a>is_show_button:</a>
					<input type="checkbox" checked={form_element.is_show_button} onChange={(e) => inputOnChange(e, "is_show_button")} />
					<Hint title="ボタンとして押せるようにするか" />
				</div>
				<div id="control_panel_is_show_close">
					<a>is_show_close:</a>
					<input type="checkbox" checked={form_element.is_show_close} onChange={(e) => inputOnChange(e, "is_show_close")} />
					<Hint
						title="フォーム右上にある閉じるボタンをその要素に表示するか&#13;&#10;既存の閉じるボタンを使用するため、サイズや位置、画像は調整できません。&#13;&#10;フォームの外枠に使用しています。"
					/>
				</div>
				<Partition />
				<div id="control_panel_text">
					<a>text</a>
					<Hint title="要素の中央に表示される文字" />
					<input style={{ width: "calc(100% - 20px)" }} value={form_element.text} onChange={(e) => inputOnChange(e, "text")} />
				</div>
				<Partition />
				<div id="control_panel_texture">
					<a>texture</a>
					<Hint
						title="要素のサイズに拡大縮小され表示される画像のパス&#13;&#10;textures/...."
					/>
					<input style={{ width: "110px" }} value={form_element.texture} onChange={(e) => inputOnChange(e, "texture")} />
				</div>
				<Partition />
				<div id="control_panel_hovertext">
					<a>hover</a>
					<Hint
						title="カーソルを要素に合わせた時もしくはタップした時に&#13;&#10;表示されるテキスト"
					/>
					<input style={{ width: "120px" }} value={form_element.hover_text} onChange={(e) => inputOnChange(e, "hover_text")} />
				</div>
				<Partition />
				<div id="control_panel_label">
					<a>label</a>
					<Hint title="ボタンが押された時にscriptAPIで取得できる値" />
					<input style={{ width: "130px" }} checked={form_element.is_show_close} onChange={(e) => inputOnChange(e, "label")} />
				</div>
			</>
		);
	}

	return (
		<div
			id="control_panel"
			style={{
				width: 200,
				boxShadow: "0 0 0 1px black inset",
				backgroundColor: themeColors[props.themeColor].control_panel.background,
				paddingLeft: "5px",
				maxHeight: `${Math.min(props.gameScreenSize.y * props.screenZoomRatio, props.formSize.y * props.screenZoomRatio)}px`,
				overflowY: "scroll",
			}}
		>
			{setting_components}
		</div>
	);
};

const Partition: React.FC = () => <div style={{ borderTop: "solid 1px #aaaaaa", width: "calc(100% - 10px)", height: "1px", margin: "3px 5px" }} />;
const Hint: React.FC<{ title: string }> = ({ title }) => (
	<a style={{ fontSize: "12px" }} title={title}>
		？
	</a>
);
