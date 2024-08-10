import { formElementsTypes, formElementsVariableTypes } from "../../formElementTypes";
import { propsType } from "../../propsType";
import { typeIdOptions } from "../../typeIdsWrapper";
import { variableReplacer } from "../../variableReplacer";
import { themeColors } from "../themeColor";
import Select from "react-select";

//コントロールパネル
export const ControlPanel: React.FC<{
	props: propsType;
}> = ({ props }) => {
	let setting_components;
	if (props.targetFormElementIndex === null) {
		//スクリーン自体の設定を表示する
		setting_components = (
			<>
				<div id="control_panel_gamesize">
					<span>game screen size</span>
					<Hint
						title="Minecraftの画面のサイズ&#13;&#10;横幅は470弱でほぼ固定。&#13;&#10;縦幅はPCフルスクリーンで約240&#13;&#10;スマホは機種によるが180前後"
					/>
					<p style={{ margin: 0, fontSize: "12px" }}>
						{props.gameScreenSize.x}px/{props.gameScreenSize.y}px
					</p>
					<div style={{ width: "calc(100% - 20px)" }}>
						<span>x:</span>
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
						<span>y:</span>
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
					<span>form size</span>
					<Hint
						title="フォームのサイズ&#13;&#10;ゲームスクリーンサイズより大きくなると表示されなかったりタップできなくなったりする。&#13;&#10;横300縦180辺りが無難?"
					/>
					<p style={{ margin: 0, fontSize: "12px" }}>
						{props.formSize.x}px/{props.formSize.y}px
					</p>
					<div style={{ width: "calc(100% - 20px)" }}>
						<span>x:</span>
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
						<span>y:</span>
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
					<span>isShowFormFrame</span>
					<Hint
						title="フォームの外枠を表示するか&#13;&#10;'true'の場合に表示されます。"
					/>
					<div style={{ width: "calc(100% - 30px)" }}>
						<input
							type="checkbox"
							checked={variableReplacer(props.isShowFormFrame, props.variable) === "true"}
							onChange={(e) => {
								const input_value = String(e.target.checked);
								props.setIsShowFormFrame(input_value);
							}}
						/>
						<input
							style={{ width: "calc(100% - 30px)" }}
							value={props.isShowFormFrame}
							onChange={(e) => {
								const input_value = e.target.value;
								props.setIsShowFormFrame(input_value);
							}}
						/>
					</div>
				</div>
				<Partition />
				<div id="control_panel_formname">
					<span>formName</span>
					<Hint
						title="コマンドで呼び出す際のフォームの名前&#13;&#10;変数は使用できません。"
					/>
					{/* フォームの名前は変数を使用しないからプレビュー的なのは要らないかな */}
					{/* <p style={{ margin: 0, fontSize: "12px" }}>{props.formName}</p> */}
					<input
						style={{ width: "calc(100% - 20px)" }}
						value={props.formName}
						onChange={(e) => {
							props.setFormName(e.target.value);
						}}
					/>
				</div>
			</>
		);
	} else {
		//その要素の設定を表示する
		const form_element = props.formElements[props.targetFormElementIndex];
		if (form_element === undefined) throw new Error("form element is not found!(control_panel)");

		//変更があった時に良い感じにStateを更新する関数
		const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof formElementsVariableTypes.elementPropertiesTypes.all) => {
			if (props.targetFormElementIndex === null) throw new Error("form element index is null");
			const form_elements: formElementsVariableTypes.elementPropertiesTypes.all[] = JSON.parse(JSON.stringify(props.formElements));
			if (key === "label") {
				if (e.target.value === "") {
					delete form_element[key];
				} else {
					form_element[key] = e.target.value;
				}
			} else {
				if (e.target.type === "checkbox") {
					form_element[key] = String(e.target.checked);
				} else {
					form_element[key] = e.target.value;
				}
			}
			form_elements[props.targetFormElementIndex] = form_element;
			props.setFormElements(form_elements);
		};
		const changeLayer = (type: "|<<" | "<" | ">" | ">>|") => {
			if (props.targetFormElementIndex === null) throw new Error("props.targetFormElementIndex is null (changeLayer)");
			const next = { "|<<": 0, "<": props.targetFormElementIndex - 1, ">": props.targetFormElementIndex + 1, ">>|": props.formElements.length - 1 };
			const new_form_elements = Array.from(props.formElements);
			const target_form_elements = new_form_elements.splice(props.targetFormElementIndex, 1);
			console.table(new_form_elements);
			console.table(target_form_elements);
			props.setFormElements(Array.from(new_form_elements).splice(0, next[type]).concat(target_form_elements).concat(Array.from(new_form_elements).splice(next[type])));
			props.setTargetFormElementIndex(next[type]);
		};
		setting_components = (
			<>
				<div id="control_panel_editmode">
					<span>操作モード</span>
					<div>
						<button style={{ width: "calc(33% - 5px)" }} disabled={props.editMode === "drag"} onClick={(e) => props.setEditMode("drag")}>
							drag
						</button>
						<button style={{ width: "calc(33% - 5px)" }} disabled={props.editMode === "resize"} onClick={(e) => props.setEditMode("resize")}>
							resize
						</button>
						<button style={{ width: "calc(33% - 5px)" }} disabled={props.editMode === "both"} onClick={(e) => props.setEditMode("both")}>
							both
						</button>
					</div>
				</div>
				<Partition />
				<div id="control_panel_layer">
					<span>レイヤー</span>
					<div>
						<button style={{ width: "40px" }} disabled={props.targetFormElementIndex === 0} onClick={(e) => changeLayer("|<<")}>
							{"|<<"}
						</button>
						<button style={{ width: "30px" }} disabled={props.targetFormElementIndex === 0} onClick={(e) => changeLayer("<")}>
							{"<"}
						</button>
						<span style={{ margin: "5px" }}>{props.targetFormElementIndex}</span>
						<button style={{ width: "30px" }} disabled={props.targetFormElementIndex === props.formElements.length - 1} onClick={(e) => changeLayer(">")}>
							{">"}
						</button>
						<button style={{ width: "40px" }} disabled={props.targetFormElementIndex === props.formElements.length - 1} onClick={(e) => changeLayer(">>|")}>
							{">>|"}
						</button>
					</div>
				</div>
				<Partition />
				<div>
					<a>サイズ</a>
					<Hint
						title="w:要素の横の大きさ&#13;&#10;h:要素の縦の大きさ"
					/>
					<div id="control_panel_w">
						<div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
							<span style={{ width: "25px" }}>w:</span>
							<span style={{ fontSize: "12px" }}>{variableReplacer(form_element.w, props.variable)}px</span>
						</div>
						<input style={{ width: "calc(100% - 20pxs)" }} value={form_element.w} onChange={(e) => inputOnChange(e, "w")} />
					</div>
					<div id="control_panel_h">
						<div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
							<span style={{ width: "25px" }}>h:</span>
							<span style={{ fontSize: "12px" }}>{variableReplacer(form_element.h, props.variable)}px</span>
						</div>
						<input style={{ width: "calc(100% - 20pxs)" }} value={form_element.h} onChange={(e) => inputOnChange(e, "h")} />
					</div>
				</div>
				<Partition />
				<div>
					<a>位置</a>
					<Hint
						title="x:フォームの左上が基準の右向きを正とした時の要素の左上の点の位置&#13;&#10;y:下向きを正とした時の要素の左上の点の位置"
					/>
					<div id="control_panel_x">
						<div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
							<span style={{ width: "25px" }}>x:</span>
							<span style={{ fontSize: "12px" }}>{variableReplacer(form_element.x, props.variable)}px</span>
						</div>
						<input style={{ width: "calc(100% - 20pxs)" }} value={form_element.x} onChange={(e) => inputOnChange(e, "x")} />
					</div>
					<div id="control_panel_y">
						<div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
							<span style={{ width: "25px" }}>y:</span>
							<span style={{ fontSize: "12px" }}>{variableReplacer(form_element.y, props.variable)}px</span>
						</div>
						<input style={{ width: "calc(100% - 20pxs)" }} value={form_element.y} onChange={(e) => inputOnChange(e, "y")} />
					</div>
				</div>
				<Partition />
				<div id="control_panel_is_show_text">
					<span>is_show_text</span>
					<Hint
						title="textで指定した文字を表示するか&#13;&#10;'true'の場合に表示されます。"
					/>
					<div style={{ display: "flex", alignItems: "center" }}>
						<input
							type="checkbox"
							checked={variableReplacer(form_element.is_show_text, props.variable) === "true"}
							onChange={(e) => inputOnChange(e, "is_show_text")}
						/>
						<input style={{ width: "calc(100% - 30px)" }} value={form_element.is_show_text} onChange={(e) => inputOnChange(e, "is_show_text")} />
					</div>
				</div>
				<div id="control_panel_is_show_image">
					<span>is_show_image</span>
					<Hint
						title="textureで指定した画像を表示するか&#13;&#10;'true'の場合に表示されます。"
					/>
					<div style={{ display: "flex", alignItems: "center" }}>
						<input
							type="checkbox"
							checked={variableReplacer(form_element.is_show_image, props.variable) === "true"}
							onChange={(e) => inputOnChange(e, "is_show_image")}
						/>
						<input style={{ width: "calc(100% - 30px)" }} value={form_element.is_show_image} onChange={(e) => inputOnChange(e, "is_show_image")} />
					</div>
				</div>
				<div id="control_panel_is_show_button">
					<span>is_show_button</span>
					<Hint
						title="ボタンとして押せるようにするか&#13;&#10;'true'の場合に表示されます。"
					/>
					<div style={{ display: "flex", alignItems: "center" }}>
						<input
							type="checkbox"
							checked={variableReplacer(form_element.is_show_button, props.variable) === "true"}
							onChange={(e) => inputOnChange(e, "is_show_button")}
						/>
						<input style={{ width: "calc(100% - 30px)" }} value={form_element.is_show_button} onChange={(e) => inputOnChange(e, "is_show_button")} />
					</div>
				</div>
				<div id="control_panel_is_show_close">
					<span>is_show_close</span>
					<Hint
						title="フォーム右上にある閉じるボタンをその要素に表示するか&#13;&#10;既存の閉じるボタンを使用するため画像を変更できないほか、細かくサイズや位置を調整できません。&#13;&#10;フォームの外枠に使用しています。"
					/>
					<div style={{ display: "flex", alignItems: "center" }}>
						<input
							type="checkbox"
							checked={variableReplacer(form_element.is_show_close, props.variable) === "true"}
							onChange={(e) => inputOnChange(e, "is_show_close")}
						/>
						<input style={{ width: "calc(100% - 30px)" }} value={form_element.is_show_close} onChange={(e) => inputOnChange(e, "is_show_close")} />
					</div>
				</div>
				<div id="control_panel_is_show_item">
					<span>is_show_item</span>
					<Hint title="auxで指定されたアイテムを表示します。" />
					<div style={{ display: "flex", alignItems: "center" }}>
						<input
							type="checkbox"
							checked={variableReplacer(form_element.is_show_item, props.variable) === "true"}
							onChange={(e) => inputOnChange(e, "is_show_item")}
						/>
						<input style={{ width: "calc(100% - 30px)" }} value={form_element.is_show_item} onChange={(e) => inputOnChange(e, "is_show_item")} />
					</div>
				</div>
				<Partition />
				<div id="control_panel_text">
					<span>text</span>
					<Hint title="要素の中央に表示される文字" />
					<p style={{ margin: 0, fontSize: "12px" }}>{variableReplacer(form_element.text, props.variable)}</p>
					<input style={{ width: "calc(100% - 20px)" }} value={form_element.text} onChange={(e) => inputOnChange(e, "text")} />
				</div>
				<Partition />
				<div id="control_panel_texture">
					<span>texture</span>
					<Hint
						title="要素のサイズに拡大縮小され表示される画像のパス&#13;&#10;textures/...."
					/>
					<p style={{ margin: 0, fontSize: "12px" }}>{variableReplacer(form_element.texture, props.variable)}</p>
					<input style={{ width: "110px" }} value={form_element.texture} onChange={(e) => inputOnChange(e, "texture")} />
				</div>
				<Partition />
				<div id="control_panel_hovertext">
					<span>hover</span>
					<Hint
						title="カーソルを要素に合わせた時もしくはタップした時に&#13;&#10;表示されるテキスト"
					/>
					<p style={{ margin: 0, fontSize: "12px" }}>{variableReplacer(form_element.hover_text, props.variable)}</p>
					<input style={{ width: "120px" }} value={form_element.hover_text} onChange={(e) => inputOnChange(e, "hover_text")} />
				</div>
				<Partition />
				<div id="control_panel_aux">
					<span>aux</span>
					<Hint
						title="インベントリーアイテムレンダラーに表示されるアイテムのaux。&#13;&#10;aux = id * 65536 (+32768 エンチャントオーラの有無)&#13;&#10;idはアップデートにより変更される可能性があります。"
					/>
					<div style={{ display: "flex" }}>
						<input
							type="checkbox"
							checked={
								Number.isNaN(Number(variableReplacer(form_element.aux, props.variable)))
									? false
									: (Number(variableReplacer(form_element.aux, props.variable)) / 65536) % 1 >= 0.5
							}
							onChange={(e) => {
								const num = Number(variableReplacer(form_element.aux, props.variable));
								if (Number.isNaN(num)) return;
								let next_value = num;
								if ((num / 65536) % 1 >= 0.5) {
									next_value -= 32768;
								} else {
									next_value += 32768;
								}

								//props更新
								const form_elements: formElementsVariableTypes.elementPropertiesTypes.all[] = JSON.parse(JSON.stringify(props.formElements));
								if (props.targetFormElementIndex === null) return window.alert("targetForrmElementIndex is null");
								form_elements[props.targetFormElementIndex].aux = String(next_value);
								props.setFormElements(form_elements);
							}}
						/>
						<p style={{ fontSize: "12px", margin: 0 }}>エンチャントのオーラ</p>
					</div>

					<Select
						options={typeIdOptions.map((v) => ({ ...v, label: v.label.replace("minecraft:", "") }))}
						styles={{
							placeholder(base, props) {
								return { ...base, fontSize: "12px" };
							},
							valueContainer(base, props) {
								return { ...base, fontSize: "12px" };
							},
							option(base, props) {
								return { ...base, fontSize: "8px" };
							},
						}}
						onChange={(e) => {
							const input = document.querySelector("#control_panel_aux > input") as HTMLInputElement;
							const value = String(e?.value ? e.value * 65536 : "");
							input.value = value;

							//props更新
							const form_elements: formElementsVariableTypes.elementPropertiesTypes.all[] = JSON.parse(JSON.stringify(props.formElements));
							if (props.targetFormElementIndex === null) return window.alert("targetForrmElementIndex is null");
							form_elements[props.targetFormElementIndex].aux = value;
							props.setFormElements(form_elements);
						}}
					/>

					<p style={{ margin: 0, fontSize: "12px" }}>{variableReplacer(String(form_element.aux), props.variable)}</p>
					<input style={{ width: "130px" }} value={form_element.aux} onChange={(e) => inputOnChange(e, "aux")} />
				</div>

				<Partition />
				<div id="control_panel_label">
					<span>label</span>
					<Hint title="ボタンが押された時にscriptAPIで取得できる値" />
					<p style={{ margin: 0, fontSize: "12px" }}>{variableReplacer(String(form_element.label), props.variable)}</p>
					<input style={{ width: "130px" }} value={form_element.label} onChange={(e) => inputOnChange(e, "label")} />
				</div>
			</>
		);
	}

	return (
		<div
			id="control_panel"
			style={{
				width: 200,
				height: `${Math.max(props.gameScreenSize.y * props.screenZoomRatio, props.formSize.y * props.screenZoomRatio)}px`,
				maxHeight: `${window.innerHeight - 50 - 50 - props.elementPanelHeight - 20}px`,
				boxShadow: "0 0 0 1px black inset",
				backgroundColor: themeColors[props.themeColor].control_panel.background,
				paddingLeft: "5px",
				overflowY: "scroll",
			}}
		>
			{setting_components}
		</div>
	);
};

const Partition: React.FC = () => <div style={{ borderTop: "solid 1px #aaaaaa", width: "calc(100% - 10px)", height: "1px", margin: "3px 5px" }} />;
const Hint: React.FC<{ title: string }> = ({ title }) => (
	<span style={{ fontSize: "12px" }} title={title}>
		？
	</span>
);
