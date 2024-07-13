import { useEffect, useState } from "react";
import { default as MoveableElement } from "./components/screen_tab/MoveableElement";
import React from "react";
import { formElementsTypes } from "./formElementTypes";
import { ElementsGenerator } from "./components/screen_tab/ElementsGenerator";
import { ControlPanel } from "./components/screen_tab/ControlPanel";
import { ElementPanel } from "./components/screen_tab/ElementPanel";
import { Header } from "./components/Header";
import { ToolBar } from "./components/ToolBar";
import { Screen } from "./components/screen_tab/Screen";
import { Output } from "./components/screen_tab/Output";
import { ScreenTab } from "./components/screen_tab/ScreenTab";
import { ImageTab } from "./components/image_tab/ImageTab";

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
	//State: フォームの枠を表示するか
	const [showFormFrame, setShowFormFrame] = useState(true);
	//State: フォームの枠を表示するか
	const [formName, setFormName] = useState("custom_form");
	//State: 選択されているタブ
	const [selectedTab, setSelectedTab] = useState<"screen" | "image" | "variable">("screen");
	//State: サイトのテーマカラー
	const [themeColor, setThemeColor] = useState<"Light" | "Dark">("Light");
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
	//State: 操作モード
	const [editMode, setEditMode] = useState<"drag" | "resize">("drag");
	//State: 保存したbase64の画像たち
	const [uploadedImages, setUploadedImages] = useState<{ [path: string]: string }>({});

	//変数
	//State: ゲームスクリーンサイズ変数
	const [gameScreenSizeVariable, setGameScreenSizeVariable] = useState({ x: "450", y: "180" });
	useEffect(() => {
		//TODO 変数置き換え
		const { x, y } = gameScreenSizeVariable;
		const x_num = Number(x);
		const y_num = Number(y);

		const set_value = { x: Number.isNaN(x_num) ? 0 : x_num, y: Number.isNaN(y_num) ? 0 : y_num };
		setGameScreenSize(set_value);
	}, [gameScreenSizeVariable]);
	//State: フォームサイズ変数
	const [formSizeVariable, setFormSizeVariable] = useState({ x: "300", y: "180" });
	useEffect(() => {
		const { x, y } = formSizeVariable;
		const x_num = Number(x);
		const y_num = Number(y);

		const set_value = { x: Number.isNaN(x_num) ? 0 : x_num, y: Number.isNaN(y_num) ? 0 : y_num };
		setFormSize(set_value);
	}, [formSizeVariable]);

	//State: ゲームスクリーンサイズ
	const [gameScreenSize, setGameScreenSize] = useState({ x: 450, y: 180 });
	//State: フォームサイズ
	const [formSize, setFormSize] = useState({ x: 300, y: 180 });
	//State: ズーム倍率
	const [screenZoomRatio, setScreenZoomRatio] = useState(getScale(gameScreenSize, formSize, elementPanelHeight));

	// ウィンドウサイズ変更時にズーム倍率変更
	window.onresize = () => {
		setScreenZoomRatio(getScale(gameScreenSize, formSize, elementPanelHeight));
	};

	const props = {
		showFormFrame,
		setShowFormFrame,
		formName,
		setFormName,
		selectedTab,
		setSelectedTab,
		themeColor,
		setThemeColor,
		gameScreenSize,
		setGameScreenSize,
		formSize,
		setFormSize,
		formId,
		setFormId,
		targetFormElementIndex,
		setTargetFormElementIndex,
		targetFormElement,
		setTargetFormElement,
		formElements,
		setFormElements,
		elementPanelHeight,
		setElementPanelHeight,
		screenZoomRatio,
		setScreenZoomRatio,
		editMode,
		setEditMode,
		uploadedImages,
		setUploadedImages,
	};

	//フォームエレメント更新時にエレメントパネルの高さ更新
	useEffect(() => setElementPanelHeight(getElementPanelHeight(formElements)), [formElements, screenZoomRatio]);

	//ターゲットインデックス更新時にターゲットを更新
	useEffect(() => {
		if (targetFormElementIndex === null) return setTargetFormElement(null);
		const form_elements_div = document.querySelector("#form_elements");
		if (form_elements_div === null) throw new Error("form_elements_div is null");
		setTargetFormElement(form_elements_div.children[targetFormElementIndex] as HTMLElement);
	}, [targetFormElementIndex]);

	//ズーム倍率更新関数
	const updateZoomRatio = (diff: number) => {
		const after = screenZoomRatio + diff * 0.01;
		//1%より小さいならreturn
		if (after < 1 * 0.01) return;
		setScreenZoomRatio(after);
	};

	let return_components;

	if (selectedTab === "screen") {
		return_components = <ScreenTab props={{ ...props }} />;
	}
	if (selectedTab === "image") {
		return_components = <ImageTab props={{ ...props }} />;
	}
	if (selectedTab === "variable") {
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
