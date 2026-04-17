import { formElementsVariableTypes } from "../../formElementTypes";
import { typeIdOptions } from "../../typeIdsWrapper";
import { variableReplacer } from "../../variableReplacer";
import { themeColors } from "../themeColor";
import Select from "react-select";
import { useAppContext } from "../../AppContext";

//コントロールパネル
export const ControlPanel: React.FC = () => {
	const {
		targetFormElementIndex,
		setTargetFormElementIndex,
		gameScreenSize,
		gameScreenSizeVariable,
		setGameScreenSizeVariable,
		formSize,
		formSizeVariable,
		setFormSizeVariable,
		isShowFormFrame,
		setIsShowFormFrame,
		formName,
		setFormName,
		formElements,
		setFormElements,
		editMode,
		setEditMode,
		variable,
		themeColor,
		screenZoomRatio,
		elementPanelHeight,
	} = useAppContext();

	let settingComponents;

	//要素が選択されているか
	if (targetFormElementIndex === null) {
		//スクリーン自体の設定を表示する
		settingComponents = (
			<>
				<div id="control_panel_gamesize">
					<span>ゲームスクリーンサイズ</span>
					<Hint title="Minecraftの画面のサイズ&#13;&#10;横幅は470弱でほぼ固定。&#13;&#10;縦幅はPCフルスクリーンで約240&#13;&#10;スマホは機種によるが180前後" />
					<p style={{ margin: 0, fontSize: "12px" }}>
						{gameScreenSize.x}px/{gameScreenSize.y}px
					</p>
					<div style={{ width: "calc(100% - 20px)" }}>
						<span>x:</span>
						<input
							style={{ width: "calc(100% - 30px)" }}
							value={gameScreenSizeVariable.x}
							onChange={(e) => {
								const inputValue = e.target.value;
								setGameScreenSizeVariable({ x: inputValue, y: gameScreenSizeVariable.y });
							}}
						/>
					</div>
					<div style={{ width: "calc(100% - 20px)" }}>
						<span>y:</span>
						<input
							style={{ width: "calc(100% - 30px)" }}
							value={gameScreenSizeVariable.y}
							onChange={(e) => {
								const inputValue = e.target.value;
								setGameScreenSizeVariable({ x: gameScreenSizeVariable.x, y: inputValue });
							}}
						/>
					</div>
				</div>
				<Partition />
				<div id="control_panel_formsize">
					<span>フォームサイズ</span>
					<Hint title="フォームのサイズ&#13;&#10;ゲームスクリーンサイズより大きくなると表示されなかったりタップできなくなったりする。&#13;&#10;横300縦180辺りが無難" />
					<p style={{ margin: 0, fontSize: "12px" }}>
						{formSize.x}px/{formSize.y}px
					</p>
					<div style={{ width: "calc(100% - 20px)" }}>
						<span>x:</span>
						<input
							style={{ width: "calc(100% - 30px)" }}
							value={formSizeVariable.x}
							onChange={(e) => {
								const inputValue = e.target.value;
								setFormSizeVariable({ x: inputValue, y: formSizeVariable.y });
							}}
						/>
					</div>
					<div style={{ width: "calc(100% - 20px)" }}>
						<span>y:</span>
						<input
							style={{ width: "calc(100% - 30px)" }}
							value={formSizeVariable.y}
							onChange={(e) => {
								const inputValue = e.target.value;
								setFormSizeVariable({ x: formSizeVariable.x, y: inputValue });
							}}
						/>
					</div>
				</div>
				<Partition />
				<div id="control_panel_showformframe">
					<span>フォームの枠</span>
					<Hint title="フォームの外枠を表示するか&#13;&#10;'true'の場合に表示されます。" />
					<div style={{ width: "calc(100% - 30px)" }}>
						<input
							type="checkbox"
							checked={variableReplacer(isShowFormFrame, variable) === "true"}
							onChange={(e) => {
								const inputValue = String(e.target.checked);
								setIsShowFormFrame(inputValue);
							}}
						/>
						<input
							style={{ width: "calc(100% - 30px)" }}
							value={isShowFormFrame}
							onChange={(e) => {
								const inputValue = e.target.value;
								setIsShowFormFrame(inputValue);
							}}
						/>
					</div>
				</div>
				<Partition />
				<div id="control_panel_formname">
					<span>フォーム名</span>
					<Hint title="コマンドで呼び出す際のフォームの名前&#13;&#10;変数は使用できません。" />
					{/* フォームの名前は変数を使用しないからプレビュー的なのは要らないかな */}
					{/* <p style={{ margin: 0, fontSize: "12px" }}>{formName}</p> */}
					<input
						style={{ width: "calc(100% - 20px)" }}
						value={formName}
						onChange={(e) => {
							setFormName(e.target.value);
						}}
					/>
				</div>
			</>
		);
	} else {
		//その要素の設定を表示する
		const formElement = formElements[targetFormElementIndex];
		if (formElement === undefined) throw new Error("form element is not found!(control_panel)");

		//変更があった時に良い感じにStateを更新する関数
		const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof formElementsVariableTypes.elementPropertiesTypes.all) => {
			if (targetFormElementIndex === null) throw new Error("form element index is null");
			const formElementsCopy: formElementsVariableTypes.elementPropertiesTypes.all[] = JSON.parse(JSON.stringify(formElements));
			if (key === "label") {
				if (e.target.value === "") {
					delete formElement[key];
				} else {
					formElement[key] = e.target.value;
				}
			} else {
				if (e.target.type === "checkbox") {
					formElement[key] = String(e.target.checked);
				} else {
					formElement[key] = e.target.value;
				}
			}
			formElementsCopy[targetFormElementIndex] = formElement;
			setFormElements(formElementsCopy);
		};
		const changeLayer = (type: "|<<" | "<" | ">" | ">>|") => {
			if (targetFormElementIndex === null) throw new Error("targetFormElementIndex is null (changeLayer)");
			const next = { "|<<": 0, "<": targetFormElementIndex - 1, ">": targetFormElementIndex + 1, ">>|": formElements.length - 1 };
			const newFormElements = Array.from(formElements);
			const targetFormElements = newFormElements.splice(targetFormElementIndex, 1);
			console.table(newFormElements);
			console.table(targetFormElements);
			setFormElements(Array.from(newFormElements).splice(0, next[type]).concat(targetFormElements).concat(Array.from(newFormElements).splice(next[type])));
			setTargetFormElementIndex(next[type]);
		};
		settingComponents = (
			<>

				<div id="control_panel_layer">
					<span>レイヤー</span>
					<div>
						<button style={{ width: "40px" }} disabled={targetFormElementIndex === 0} onClick={(e) => changeLayer("|<<")}>
							{"|<<"}
						</button>
						<button style={{ width: "30px" }} disabled={targetFormElementIndex === 0} onClick={(e) => changeLayer("<")}>
							{"<"}
						</button>
						<span style={{ margin: "5px" }}>{targetFormElementIndex}</span>
						<button style={{ width: "30px" }} disabled={targetFormElementIndex === formElements.length - 1} onClick={(e) => changeLayer(">")}>
							{">"}
						</button>
						<button style={{ width: "40px" }} disabled={targetFormElementIndex === formElements.length - 1} onClick={(e) => changeLayer(">>|")}>
							{">>|"}
						</button>
					</div>
				</div>
				<Partition />
				<div>
					<a>サイズ</a>
					<Hint title="w:要素の横の大きさ&#13;&#10;h:要素の縦の大きさ" />
					<div id="control_panel_w">
						<div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
							<span style={{ width: "25px" }}>w:</span>
							<span style={{ fontSize: "12px" }}>{variableReplacer(formElement.w, variable)}px</span>
						</div>
						<input style={{ width: "calc(100% - 20pxs)" }} value={formElement.w} onChange={(e) => inputOnChange(e, "w")} />
					</div>
					<div id="control_panel_h">
						<div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
							<span style={{ width: "25px" }}>h:</span>
							<span style={{ fontSize: "12px" }}>{variableReplacer(formElement.h, variable)}px</span>
						</div>
						<input style={{ width: "calc(100% - 20pxs)" }} value={formElement.h} onChange={(e) => inputOnChange(e, "h")} />
					</div>
				</div>
				<Partition />
				<div>
					<a>位置</a>
					<Hint title="x:フォームの左上が基準の右向きを正とした時の要素の左上の点の位置&#13;&#10;y:下向きを正とした時の要素の左上の点の位置" />
					<div id="control_panel_x">
						<div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
							<span style={{ width: "25px", color: "#353535ff" }}>x:</span>
							<span style={{ fontSize: "12px" }}>{variableReplacer(formElement.x, variable)}px</span>
						</div>
						<input style={{ width: "calc(100% - 20pxs)" }} value={formElement.x} onChange={(e) => inputOnChange(e, "x")} />
					</div>
					<div id="control_panel_y">
						<div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
							<span style={{ width: "25px", color: "#353535ff" }}>y:</span>
							<span style={{ fontSize: "12px" }}>{variableReplacer(formElement.y, variable)}px</span>
						</div>
						<input style={{ width: "calc(100% - 20pxs)" }} value={formElement.y} onChange={(e) => inputOnChange(e, "y")} />
					</div>
				</div>
				<Partition />
				<a>表示するか</a>
				<div id="control_panel_is_show_text">
					<span style={{ color: "#353535ff" }}>テキスト</span>
					<Hint title="textで指定した文字を表示するか&#13;&#10;'true'の場合に表示されます。" />
					<div style={{ display: "flex", alignItems: "center" }}>
						<input
							type="checkbox"
							checked={variableReplacer(formElement.is_show_text, variable) === "true"}
							onChange={(e) => inputOnChange(e, "is_show_text")}
						/>
						<input style={{ width: "calc(100% - 30px)" }} value={formElement.is_show_text} onChange={(e) => inputOnChange(e, "is_show_text")} />
					</div>
				</div>
				<div id="control_panel_is_show_image">
					<span style={{ color: "#353535ff" }}>画像</span>
					<Hint title="textureで指定した画像を表示するか&#13;&#10;'true'の場合に表示されます。" />
					<div style={{ display: "flex", alignItems: "center" }}>
						<input
							type="checkbox"
							checked={variableReplacer(formElement.is_show_image, variable) === "true"}
							onChange={(e) => inputOnChange(e, "is_show_image")}
						/>
						<input style={{ width: "calc(100% - 30px)" }} value={formElement.is_show_image} onChange={(e) => inputOnChange(e, "is_show_image")} />
					</div>
				</div>
				<div id="control_panel_is_show_button">
					<span style={{ color: "#353535ff" }}>ボタン</span>
					<Hint title="ボタンとして押せるようにするか&#13;&#10;'true'の場合に表示されます。" />
					<div style={{ display: "flex", alignItems: "center" }}>
						<input
							type="checkbox"
							checked={variableReplacer(formElement.is_show_button, variable) === "true"}
							onChange={(e) => inputOnChange(e, "is_show_button")}
						/>
						<input style={{ width: "calc(100% - 30px)" }} value={formElement.is_show_button} onChange={(e) => inputOnChange(e, "is_show_button")} />
					</div>
				</div>
				<div id="control_panel_is_show_close">
					<span style={{ color: "#353535ff" }}>閉じる</span>
					<Hint title="フォーム右上にある閉じるボタンをその要素に表示するか&#13;&#10;既存の閉じるボタンを使用するため画像やサイズ、位置を調整できません。" />
					<div style={{ display: "flex", alignItems: "center" }}>
						<input
							type="checkbox"
							checked={variableReplacer(formElement.is_show_close, variable) === "true"}
							onChange={(e) => inputOnChange(e, "is_show_close")}
						/>
						<input style={{ width: "calc(100% - 30px)" }} value={formElement.is_show_close} onChange={(e) => inputOnChange(e, "is_show_close")} />
					</div>
				</div>
				<div id="control_panel_is_show_item">
					<span style={{ color: "#353535ff" }}>アイテム</span>
					<Hint title="auxで指定されたアイテムを表示します。" />
					<div style={{ display: "flex", alignItems: "center" }}>
						<input
							type="checkbox"
							checked={variableReplacer(formElement.is_show_item, variable) === "true"}
							onChange={(e) => inputOnChange(e, "is_show_item")}
						/>
						<input style={{ width: "calc(100% - 30px)" }} value={formElement.is_show_item} onChange={(e) => inputOnChange(e, "is_show_item")} />
					</div>
				</div>
				<Partition />
				<div id="control_panel_text">
					<span>text</span>
					<Hint title="要素の中央に表示される文字" />
					<p style={{ margin: 0, fontSize: "12px" }}>{variableReplacer(formElement.text, variable)}</p>
					<input style={{ width: "calc(100% - 20px)" }} value={formElement.text} onChange={(e) => inputOnChange(e, "text")} />
				</div>
				<Partition />
				<div id="control_panel_texture">
					<span>texture</span>
					<Hint title="要素のサイズに拡大縮小され表示される画像のパス&#13;&#10;textures/...." />
					<p style={{ margin: 0, fontSize: "12px" }}>{variableReplacer(formElement.texture, variable)}</p>
					<input style={{ width: "110px" }} value={formElement.texture} onChange={(e) => inputOnChange(e, "texture")} />
				</div>
				<Partition />
				<div id="control_panel_command">
					<span>command</span>
					<Hint title="ボタンが押された時に実行されるコマンド&#13;&#10;" />
					<p style={{ margin: 0, fontSize: "12px" }}>{variableReplacer(formElement.command, variable)}</p>
					<input style={{ width: "110px" }} value={formElement.command} onChange={(e) => inputOnChange(e, "command")} />
				</div>
				<Partition />
				<div id="control_panel_hovertext">
					<span>hover</span>
					<Hint title="カーソルを要素に合わせた時もしくはタップした時に&#13;&#10;表示されるテキスト" />
					<p style={{ margin: 0, fontSize: "12px" }}>{variableReplacer(formElement.hover_text, variable)}</p>
					<input style={{ width: "120px" }} value={formElement.hover_text} onChange={(e) => inputOnChange(e, "hover_text")} />
				</div>
				<Partition />
				<div id="control_panel_aux">
					<span>aux</span>
					<Hint title="インベントリーアイテムレンダラーに表示されるアイテムのaux。&#13;&#10;aux = id * 65536 (+32768 エンチャントオーラの有無)&#13;&#10;idはアップデートにより変更される可能性があります。" />
					<div style={{ display: "flex" }}>
						<input
							type="checkbox"
							checked={
								Number.isNaN(Number(variableReplacer(formElement.aux, variable)))
									? false
									: (Number(variableReplacer(formElement.aux, variable)) / 65536) % 1 >= 0.5
							}
							onChange={(e) => {
								const num = Number(variableReplacer(formElement.aux, variable));
								if (Number.isNaN(num)) return;
								let nextValue = num;
								if ((num / 65536) % 1 >= 0.5) {
									nextValue -= 32768;
								} else {
									nextValue += 32768;
								}

								//props更新
								const formElementsCopy: formElementsVariableTypes.elementPropertiesTypes.all[] = JSON.parse(JSON.stringify(formElements));
								if (targetFormElementIndex === null) return window.alert("targetFormElementIndex is null");
								formElementsCopy[targetFormElementIndex].aux = String(nextValue);
								setFormElements(formElementsCopy);
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
							const formElementsCopy: formElementsVariableTypes.elementPropertiesTypes.all[] = JSON.parse(JSON.stringify(formElements));
							if (targetFormElementIndex === null) return window.alert("targetForrmElementIndex is null");
							formElementsCopy[targetFormElementIndex].aux = value;
							setFormElements(formElementsCopy);
						}}
					/>

					<p style={{ margin: 0, fontSize: "12px" }}>{variableReplacer(String(formElement.aux), variable)}</p>
					<input style={{ width: "130px" }} value={formElement.aux} onChange={(e) => inputOnChange(e, "aux")} />
				</div>

				<Partition />
				<div id="control_panel_label">
					<span>label</span>
					<Hint title="ボタンが押された時にscriptAPIで取得できる値" />
					<p style={{ margin: 0, fontSize: "12px" }}>{variableReplacer(String(formElement.label), variable)}</p>
					<input style={{ width: "130px" }} value={formElement.label} onChange={(e) => inputOnChange(e, "label")} />
				</div>
			</>
		);
	}

	return (
		<div
			id="control_panel"
			style={{
				width: 200,
				height: `${Math.max(gameScreenSize.y * screenZoomRatio, formSize.y * screenZoomRatio)}px`,
				maxHeight: `${window.innerHeight - 50 - 50 - elementPanelHeight - 20}px`,
				boxShadow: "0 0 0 1px black inset",
				backgroundColor: themeColors[themeColor].control_panel.background,
				paddingLeft: "5px",
				overflowY: "scroll",
			}}
		>
			{settingComponents}
		</div>
	);
};

const Partition: React.FC = () => <div style={{ borderTop: "solid 1px #aaaaaa", width: "calc(100% - 10px)", height: "1px", margin: "3px 5px" }} />;
const Hint: React.FC<{ title: string }> = ({ title }) => (
	<span style={{ fontSize: "12px" }} title={title}>
		？
	</span>
);
