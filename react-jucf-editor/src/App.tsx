import { useEffect, useState } from "react";
import React from "react";
import { formElementsVariableTypes } from "./formElementTypes";
import { Header } from "./components/Header";
import { ToolBar } from "./components/ToolBar";
import { ScreenTab } from "./components/screen_tab/ScreenTab";
import { ImageTab } from "./components/image_tab/ImageTab";
import { variableReplacer } from "./variableReplacer";
import { VariableTab } from "./components/variable_tab/VariableTab";
import { AppContext } from "./AppContext";

//ウィンドウサイズとゲームスクリーンサイズの比を返す関数
function getScale(gameScreenSize: { x: number; y: number }, formSize: { x: number; y: number }, elementPanelHeight: number, isShowControlPanel: boolean) {
	const windowX = window.innerWidth - 90 - 20 - (isShowControlPanel ? 220 : 0); //左ツールバー(90) + 余分(20) + コントロールパネル(220)
	const windowY = window.innerHeight - 50 - 50 - elementPanelHeight - 20; //  header + toolbar + under + 余分
	if (windowX < 0 || windowY < 0) return 0;
	const maxScreenSizeX = Math.max(gameScreenSize.x, formSize.x);
	const maxScreenSizeY = Math.max(gameScreenSize.y, formSize.y);
	const scaleX = windowX / maxScreenSizeX;
	const scaleY = windowY / maxScreenSizeY;

	const minScale = Math.min(scaleX, scaleY);
	return Number(Math.floor(minScale * 10)) * 0.1; //o.oo
}
//フォームエレメントからエレメントパネルの高さを求める関数
function getElementPanelHeight(formElements: formElementsVariableTypes.elementPropertiesTypes.all[]) {
	if (formElements.length === 0) return 100;
	const widthElementCount = Math.floor((window.innerWidth - 20) / 100); //横方向に何個並べられるか
	const heightElementCount = Math.ceil(formElements.length / widthElementCount); //縦方向に何列必要か
	if (heightElementCount > 2) return 200;
	return heightElementCount * 100;
}

function App() {
	//State: フォームの枠を表示するか
	const [isShowFormFrame, setIsShowFormFrame] = useState("true");
	//State: フォーム名
	const [formName, setFormName] = useState("custom_form");
	//State: 選択されているタブ
	const [selectedTab, setSelectedTab] = useState<"screen" | "image" | "variable">("screen");
	//State: サイトのテーマカラー
	const [themeColor, setThemeColor] = useState<"Light" | "Dark">("Light");
	//State: ターゲットエレメントインデックス
	const [targetFormElementIndex, setTargetFormElementIndex] = useState<number | null>(null);
	//State: ターゲットエレメント
	const [targetFormElement, setTargetFormElement] = useState<null | HTMLElement>(null);
	//State: エレメントのリスト
	const [formElements, setFormElements] = useState<formElementsVariableTypes.elementPropertiesTypes.all[]>([]);
	//State: エレメントパネルの高さ
	const [elementPanelHeight, setElementPanelHeight] = useState(0);
	//State: 操作モード
	const [editMode, setEditMode] = useState<"drag" | "resize" | "both">("drag");
	//State: 保存したbase64の画像たち
	const [uploadedImages, setUploadedImages] = useState<{ [path: string]: string }>({});

	//変数
	const [variable, setVariable] = useState<{ [key: string]: string | number | boolean }>({});

	//State: ゲームスクリーンサイズ変数
	const [gameScreenSizeVariable, setGameScreenSizeVariable] = useState({ x: "450", y: "180" });
	useEffect(() => {
		const { x, y } = gameScreenSizeVariable;
		const xNum = Number(variableReplacer(x, variable));
		const yNum = Number(variableReplacer(y, variable));

		const setValue = { x: Number.isNaN(xNum) ? 0 : xNum, y: Number.isNaN(yNum) ? 0 : yNum };
		setGameScreenSize(setValue);
	}, [gameScreenSizeVariable]);
	//State: フォームサイズ変数
	const [formSizeVariable, setFormSizeVariable] = useState({ x: "300", y: "180" });
	useEffect(() => {
		const { x, y } = formSizeVariable;
		const xNum = Number(variableReplacer(x, variable));
		const yNum = Number(variableReplacer(y, variable));

		const setValue = { x: Number.isNaN(xNum) ? 0 : xNum, y: Number.isNaN(yNum) ? 0 : yNum };
		setFormSize(setValue);
	}, [formSizeVariable]);

	//State: ゲームスクリーンサイズ
	const [gameScreenSize, setGameScreenSize] = useState({ x: 450, y: 180 });
	//State: フォームサイズ
	const [formSize, setFormSize] = useState({ x: 300, y: 180 });
	//State: コントロールパネルの表示状態
	const [isShowControlPanel, setIsShowControlPanel] = useState(true);
	//State: ズーム倍率
	const [screenZoomRatio, setScreenZoomRatio] = useState(getScale(gameScreenSize, formSize, elementPanelHeight, isShowControlPanel));

	// ウィンドウサイズ変更時やパネル開閉時にズーム倍率変更
	window.onresize = () => {
		setScreenZoomRatio(getScale(gameScreenSize, formSize, elementPanelHeight, isShowControlPanel));
	};
	useEffect(() => {
		setScreenZoomRatio(getScale(gameScreenSize, formSize, elementPanelHeight, isShowControlPanel));
	}, [gameScreenSize, formSize, elementPanelHeight, isShowControlPanel]);

	//フォームエレメント更新時にエレメントパネルの高さ更新
	useEffect(() => setElementPanelHeight(getElementPanelHeight(formElements)), [formElements, screenZoomRatio]);

	//ターゲットインデックス更新時にターゲットを更新
	useEffect(() => {
		if (targetFormElementIndex === null) return setTargetFormElement(null);
		const formElementsDiv = document.querySelector("#form_elements");
		if (formElementsDiv === null) throw new Error("formElementsDiv is null");
		setTargetFormElement(formElementsDiv.children[targetFormElementIndex] as HTMLElement);
	}, [targetFormElementIndex]);

	//State: undo記録用
	const [statePastRecoder, setStatePastRecoder] = useState<{ elements: typeof formElements; index: typeof targetFormElementIndex }[]>([]);
	const [stateFutureRecoder, setStateFutureRecoder] = useState<{ elements: typeof formElements; index: typeof targetFormElementIndex }[]>([]);
	const [isDontRecode, setIsDontRecode] = useState(true);
	//undoとredo
	useEffect(() => {
		if (isDontRecode) {
			setIsDontRecode(false);
			return;
		}
		if (statePastRecoder.length !== 0) {
			const recoder = statePastRecoder[statePastRecoder.length - 1];
			if (recoder.elements === formElements && recoder.index === targetFormElementIndex) return;
		}
		statePastRecoder.push({ elements: formElements.map((e) => ({ ...e })), index: targetFormElementIndex });
		setStatePastRecoder(statePastRecoder);
		setStateFutureRecoder([]);
	}, [formElements, targetFormElementIndex]);

	const contextValue = {
		isShowFormFrame,
		setIsShowFormFrame,
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
		isShowControlPanel,
		setIsShowControlPanel,
		editMode,
		setEditMode,
		uploadedImages,
		setUploadedImages,
		formSizeVariable,
		setFormSizeVariable,
		gameScreenSizeVariable,
		setGameScreenSizeVariable,
		variable,
		setVariable,
		statePastRecoder,
		setStatePastRecoder,
		stateFutureRecoder,
		setStateFutureRecoder,
		isDontRecode,
		setIsDontRecode,
	};

	let returnComponents;

	if (selectedTab === "screen") {
		returnComponents = <ScreenTab />;
	}
	if (selectedTab === "image") {
		returnComponents = <ImageTab />;
	}
	if (selectedTab === "variable") {
		returnComponents = <VariableTab />;
	}
	return (
		<AppContext.Provider value={contextValue}>
			<div className="App">
				<Header />
				<ToolBar />

				{returnComponents}
			</div>
		</AppContext.Provider>
	);
}

export default App;
