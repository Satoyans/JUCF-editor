import { formElementsTypes } from "../../formElementTypes";
import { themeColors } from "../themeColor";

//コントロールパネル
export const ControlPanel: React.FC<{
	props: {
		themeColor: "Light" | "Dark";
		elementPanelHeight: number;
		formElements: formElementsTypes.elementPropertiesTypes.all[];
		setFormElements: React.Dispatch<React.SetStateAction<formElementsTypes.elementPropertiesTypes.all[]>>;
		targetFormElement: null | HTMLElement;
		setTargetFormElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
		targetFormElementIndex: number | null;
		setTargetFormElementIndex: React.Dispatch<React.SetStateAction<number | null>>;
		formSize: {
			x: number;
			y: number;
		};
		setFormSize: React.Dispatch<
			React.SetStateAction<{
				x: number;
				y: number;
			}>
		>;
		gameScreenSize: {
			x: number;
			y: number;
		};
		setGameScreenSize: React.Dispatch<
			React.SetStateAction<{
				x: number;
				y: number;
			}>
		>;
		editMode: "drag" | "resize";
		setEditMode: React.Dispatch<React.SetStateAction<"drag" | "resize">>;
		showFormFrame: boolean;
		setShowFormFrame: React.Dispatch<React.SetStateAction<boolean>>;
		formName: string;
		setFormName: React.Dispatch<React.SetStateAction<string>>;
	};
}> = ({ props }) => {
	const input_style = { width: "30px" };
	let setting_components;
	if (props.targetFormElementIndex === null) {
		//スクリーン自体の設定を表示する
		setting_components = (
			<>
				<div id="control_panel_gamesize">
					<a>game:</a>
					<input
						style={{ ...input_style }}
						value={props.gameScreenSize.x}
						onChange={(e) => {
							const input_value = Number(e.target.value);
							if (Number.isNaN(input_value)) return;
							props.setGameScreenSize({ x: input_value, y: props.gameScreenSize.y });
						}}
					/>
					<a>px/</a>
					<input
						style={{ ...input_style }}
						value={props.gameScreenSize.y}
						onChange={(e) => {
							const input_value = Number(e.target.value);
							if (Number.isNaN(input_value)) return;
							props.setGameScreenSize({ x: props.gameScreenSize.x, y: input_value });
						}}
					/>
					<a>px</a>
					<a
						title="Minecraftの画面のサイズ&#13;&#10;横幅は470弱でほぼ固定。&#13;&#10;縦幅はPCフルスクリーンで約240&#13;&#10;スマホは機種によるが180前後"
					>
						？
					</a>
				</div>
				<div id="control_panel_formsize">
					<a>form:</a>
					<input
						style={{ ...input_style }}
						value={props.formSize.x}
						onChange={(e) => {
							const input_value = Number(e.target.value);
							if (Number.isNaN(input_value)) return;
							props.setFormSize({ x: input_value, y: props.formSize.y });
						}}
					/>
					<a>px/</a>
					<input
						style={{ ...input_style }}
						value={props.formSize.y}
						onChange={(e) => {
							const input_value = Number(e.target.value);
							if (Number.isNaN(input_value)) return;
							props.setFormSize({ x: props.formSize.x, y: input_value });
						}}
					/>
					<a>px</a>
					<a
						title="フォームのサイズ&#13;&#10;ゲームスクリーンサイズより大きくなると表示されなかったりタップできなくなったりする。&#13;&#10;横300縦180辺りが無難?"
					>
						？
					</a>
				</div>
				<div id="control_panel_showformframe">
					<a>showFormFrame:</a>
					<input
						type="checkbox"
						checked={props.showFormFrame}
						onChange={(e) => {
							props.setShowFormFrame((e.target as HTMLInputElement).checked);
						}}
					/>

					<a title="フォームの枠を表示するか">？</a>
				</div>
				<div id="control_panel_formname">
					<a>formName:</a>
					<input
						style={{ width: "80px" }}
						value={props.formName}
						onChange={(e) => {
							props.setShowFormFrame((e.target as HTMLInputElement).checked);
						}}
					/>

					<a title="コマンドで呼び出す際のフォームの名前">？</a>
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
				<div id="control_panel_w">
					<a>w:</a>
					<input style={input_style} value={form_element.w} onChange={(e) => inputOnChange(e, "w")} />
					<a>px</a>
					<a
						title="width&#13;&#10;要素の横の大きさ"
					>
						？
					</a>
				</div>
				<div id="control_panel_h">
					<a>h:</a>
					<input style={input_style} value={form_element.h} onChange={(e) => inputOnChange(e, "h")} />
					<a>px</a>
					<a
						title="height&#13;&#10;要素の縦の大きさ"
					>
						？
					</a>
				</div>
				<div id="control_panel_x">
					<a>x:</a>
					<input style={input_style} value={form_element.x} onChange={(e) => inputOnChange(e, "x")} />
					<a>px</a>
					<a
						title="フォームの左上が基準の右向きを正とした時の&#13;&#10;要素の左上の点の位置"
					>
						？
					</a>
				</div>
				<div id="control_panel_y">
					<a>y:</a>
					<input style={input_style} value={form_element.y} onChange={(e) => inputOnChange(e, "y")} />
					<a>px</a>
					<a
						title="フォームの左上が基準の下向きを正とした時の&#13;&#10;要素の左上の点の位置"
					>
						？
					</a>
				</div>
				<div id="control_panel_text">
					<a>text:</a>
					<input style={{ width: "135px" }} value={form_element.text} onChange={(e) => inputOnChange(e, "text")} />
					<a title="要素の中央に表示される文字">？</a>
				</div>
				<div id="control_panel_texture">
					<a>texture:</a>
					<input style={{ width: "110px" }} value={form_element.texture} onChange={(e) => inputOnChange(e, "texture")} />
					<a
						title="要素のサイズに拡大縮小され表示される画像のパス&#13;&#10;textures/...."
					>
						？
					</a>
				</div>
				<div id="control_panel_hovertext">
					<a>hover_text:</a>
					<input style={{ width: "175px" }} value={form_element.hover_text} onChange={(e) => inputOnChange(e, "hover_text")} />
					<a
						title="カーソルを要素に合わせた時もしくはタップした時に&#13;&#10;表示されるテキスト"
					>
						？
					</a>
				</div>
				<div id="control_panel_is_show_text">
					<a>is_show_text:</a>
					<input type="checkbox" checked={form_element.is_show_text} onChange={(e) => inputOnChange(e, "is_show_text")} />
					<a title="textで指定した文字を表示するか">？</a>
				</div>
				<div id="control_panel_is_show_image">
					<a>is_show_image:</a>
					<input type="checkbox" checked={form_element.is_show_image} onChange={(e) => inputOnChange(e, "is_show_image")} />
					<a title="textureで指定した画像を表示するか">？</a>
				</div>
				<div id="control_panel_is_show_button">
					<a>is_show_button:</a>
					<input type="checkbox" checked={form_element.is_show_button} onChange={(e) => inputOnChange(e, "is_show_button")} />
					<a title="ボタンとして押せるようにするか">？</a>
				</div>
				<div id="control_panel_is_show_close">
					<a>is_show_close:</a>
					<input type="checkbox" checked={form_element.is_show_close} onChange={(e) => inputOnChange(e, "is_show_close")} />
					<a
						title="フォーム右上にある閉じるボタンをその要素に表示するか&#13;&#10;既存の閉じるボタンを使用するため、サイズや位置、画像は調整できません。&#13;&#10;フォームの外枠に使用しています。"
					>
						？
					</a>
				</div>
				<div id="control_panel_label">
					<a>label:</a>
					<input style={{ width: "130px" }} checked={form_element.is_show_close} onChange={(e) => inputOnChange(e, "label")} />
					<a title="ボタンが押された時にscriptAPIで取得できる値">？</a>
				</div>
			</>
		);
	}

	return (
		<div id="control_panel" style={{ width: 200, boxShadow: "0 0 0 1px black inset", backgroundColor: themeColors[props.themeColor].control_panel.background, padding: "2px" }}>
			{setting_components}
		</div>
	);
};
