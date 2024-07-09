import { useEffect, useState } from "react";
import { default as MoveableElement } from "./components/MoveableElement";
import React from "react";
import { formElementsTypes } from "./formElementTypes";
import { ElementsGenerator } from "./components/ElementsGenerator";
import { ControlPanel } from "./components/ControlPanel";
import { ElementPanel } from "./components/ElementPanel";
import { Header } from "./components/Header";
import { ToolBar } from "./components/ToolBar";
import { Screen } from "./components/Screen";

//ウィンドウサイズとゲームスクリーンサイズの比を返す関数
function getScale(game_screen_size: { x: number; y: number }, form_size: { x: number; y: number }, elementPanelHeight: number) {
	const window_x = window.innerWidth - 20 - 200; //余分 + コントロールパネル
	const window_y = window.innerHeight - 50 - 50 - elementPanelHeight - 20; //  header + toolbar + under + 余分
	if (window_x < 0 || window_y < 0) return 0;
	const max_screen_size_x = Math.max(game_screen_size.x, form_size.x);
	const max_screen_size_y = Math.max(game_screen_size.y, form_size.y);
	const scaleX = window_x / max_screen_size_x;
	const scaleY = window_y / max_screen_size_y;

	const minScale = Math.min(scaleX, scaleY);
	console.log(minScale);
	return Number(Math.floor(minScale * 10)) * 0.1; //o.oo
}
//フォームエレメントからエレメントパネルの高さを求める関数
function getElementPanelHeight(form_elements: formElementsTypes.elementPropertiesTypes.all[]) {
	if (form_elements.length === 0) return 100;
	const width_element_count = Math.floor((window.innerWidth - 20) / 100); //横方向に何個並べられるか
	const height_element_count = Math.ceil(form_elements.length / width_element_count); //縦方向に何列必要か
	if (height_element_count > 2) return 200;
	return height_element_count * 100;
}

function App() {
	//State: 選択されているタブ
	const [selectedTab, setSelectedTab] = useState<"screen" | "image" | "variable">("screen");
	//State: サイトのテーマカラー
	const [themeColor, setThemeColor] = useState<"Light" | "Dark">("Light");
	//State: ゲームスクリーンサイズ
	const [gameScreenSize, setGameScreenSize] = useState({ x: 450, y: 180 });
	//State: フォームサイズ
	const [formSize, setFormSize] = useState({ x: 300, y: 180 });
	//State: フォームid
	const [formId, setFormId] = useState("custom_form");
	//State: ターゲットエレメントインデックス
	const [targetFormElementIndex, setTargetFormElementIndex] = useState<number | null>(null);
	//State: ターゲットエレメント
	const [targetFormElement, setTargetFormElement] = useState<null | HTMLElement>(null);
	//State: エレメントのリスト
	const [formElements, setFormElements] = useState<formElementsTypes.elementPropertiesTypes.all[]>([]);
	//State: エレメントパネルの高さ
	const [elementPanelHeight, setElementPanelHeight] = useState(0);
	//State: ズーム倍率
	const [screenZoomRatio, setScreenZoomRatio] = useState(getScale(gameScreenSize, formSize, elementPanelHeight));
	//State: 操作モード
	const [editMode, setEditMode] = useState<"drag" | "resize">("drag");

	//フォームエレメント更新時にエレメントパネルの高さ更新
	useEffect(() => setElementPanelHeight(getElementPanelHeight(formElements)), [formElements, screenZoomRatio]);

	//ターゲットインデックス更新時にターゲットを更新
	useEffect(() => {
		if (targetFormElementIndex === null) return setTargetFormElement(null);
		const form_elements_div = document.querySelector("#form_elements");
		if (form_elements_div === null) throw new Error("form_elements_div is null");
		setTargetFormElement(form_elements_div.children[targetFormElementIndex] as HTMLElement);
	}, [targetFormElementIndex]);

	// ウィンドウサイズ変更時に実行;
	window.onresize = () => {
		setScreenZoomRatio(getScale(gameScreenSize, formSize, elementPanelHeight));
	};

	//テキストエリア用のステート
	const [formElementsCopy, setFormElementsCopy] = useState<string>("");
	useEffect(() => {
		setFormElementsCopy(JSON.stringify(formElements, null, 2));
	}, [formElements]);

	//ズーム倍率更新関数
	const updateZoomRatio = (diff: number) => {
		const after = screenZoomRatio + diff * 0.01;
		//1%より小さいならreturn
		if (after < 1 * 0.01) return;
		setScreenZoomRatio(after);
	};

	let return_components;

	if (selectedTab === "screen") {
		return_components = (
			<>
				<div style={{ display: "flex", flexDirection: "row", borderBottom: "solid 1px black" }}>
					<Screen
						props={{
							formId,
							themeColor,
							gameScreenSize,
							formSize,
							screenZoomRatio,
							setScreenZoomRatio,
							targetFormElementIndex,
							setTargetFormElementIndex,
							elementPanelHeight,
						}}
					>
						<ElementsGenerator props={{ formElements, setFormElements, screenZoomRatio, setScreenZoomRatio, targetFormElementIndex, setTargetFormElementIndex }} />
						<MoveableElement props={{ targetFormElement, setTargetFormElement, screenZoomRatio, formSize, gameScreenSize, formElements, setFormElements, editMode }} />
					</Screen>
					<ControlPanel
						props={{
							themeColor,
							elementPanelHeight,
							formElements,
							setFormElements,
							targetFormElement,
							setTargetFormElement,
							targetFormElementIndex,
							setTargetFormElementIndex,
							formSize,
							setFormSize,
							gameScreenSize,
							setGameScreenSize,
							editMode,
							setEditMode,
						}}
					/>
				</div>
				<ElementPanel
					props={{ themeColor, elementPanelHeight, formElements, targetFormElement, setTargetFormElement, targetFormElementIndex, setTargetFormElementIndex }}
				/>
				{/* <div id="dev_info" style={{ maxHeight: "100px" }}>
					<p>
						window:{window.innerWidth}/{window.innerHeight}
					</p>
					<div id="div_info_gameScreenSize">
						<a>game:</a>
						<input
							value={gameScreenSize.x}
							onChange={(e) => {
								const input_value = Number(e.target.value);
								if (Number.isNaN(input_value)) return;
								setGameScreenSize({ x: input_value, y: gameScreenSize.y });
							}}
						/>
						<a>/</a>
						<input
							value={gameScreenSize.y}
							onChange={(e) => {
								const input_value = Number(e.target.value);
								if (Number.isNaN(input_value)) return;
								setGameScreenSize({ x: gameScreenSize.x, y: input_value });
							}}
						/>
					</div>
					<div id="div_info_formSize">
						<a>form:</a>
						<input
							value={formSize.x}
							onChange={(e) => {
								const input_value = Number(e.target.value);
								if (Number.isNaN(input_value)) return;
								setFormSize({ x: input_value, y: formSize.y });
							}}
						/>
						<a>/</a>
						<input
							value={formSize.y}
							onChange={(e) => {
								const input_value = Number(e.target.value);
								if (Number.isNaN(input_value)) return;
								setFormSize({ x: formSize.x, y: input_value });
							}}
						/>
					</div>
					<p>zoom:{(screenZoomRatio * 100).toFixed(0)}%</p>
					<div>
						<button type="button" onClick={(e) => updateZoomRatio(-50)}>
							{"<<"}
						</button>
						<button type="button" onClick={(e) => updateZoomRatio(-10)}>
							{"<"}
						</button>
						<button type="button" onClick={(e) => updateZoomRatio(10)}>
							{">"}
						</button>
						<button type="button" onClick={(e) => updateZoomRatio(50)}>
							{">>"}
						</button>
					</div>
				</div> */}
				<div>
					<button
						onClick={(e) => {
							try {
								const form_elements = JSON.parse(((e.target as HTMLButtonElement).parentElement?.querySelector("textarea") as HTMLTextAreaElement).value);
								let index_count = 0;
								for (let form_element of form_elements) {
									const element_type: formElementsTypes.elementPropertiesTypes.all = {
										h: 0,
										w: 0,
										x: 0,
										y: 0,
										hover_text: "",
										texture: "",
										text: "",
										is_show_button: true,
										is_show_close: true,
										is_show_image: true,
										is_show_text: true,
									};
									if (Object.keys(form_element).length !== Object.keys(element_type).length) throw new Error(`キーの数が異常です。index:${index_count}`);
									for (let key of Object.keys(form_element)) {
										if (!Object.keys(element_type).includes(key)) throw new Error(`キーが異常です。index:${index_count},key:${key}`);
										const typed_key = key as
											| "h"
											| "w"
											| "x"
											| "y"
											| "hover_text"
											| "texture"
											| "text"
											| "is_show_button"
											| "is_show_close"
											| "is_show_image"
											| "is_show_text";
										if (typeof form_element[key] !== typeof element_type[typed_key]) throw new Error(`値の型が異常です。index:${index_count},key:${key}`);
									}
									console.log(Object.keys(form_element));
									index_count += 1;
								}
								setFormElements(form_elements);
							} catch (e) {
								window.alert(`テキストエリアからの読み込み中にエラー:\n${e}`);
							}
						}}
					>
						ロード
					</button>
					<textarea
						value={formElementsCopy}
						onChange={(e) => setFormElementsCopy(e.target.value)}
						style={{ fontSize: 12, height: `${((JSON.stringify(formElements, null, 2).match(/\n/g)?.length ?? 0) + 1) * 12}px`, width: "calc(100% - 10px)" }}
					></textarea>
				</div>
			</>
		);
	}

	return (
		<div className="App">
			<Header />
			<ToolBar props={{ formElements, setFormElements, setTargetFormElementIndex, targetFormElementIndex, selectedTab, setSelectedTab, themeColor }} />
			{return_components}
		</div>
	);
}

export default App;
