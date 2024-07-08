import { useEffect, useState } from "react";
import { default as MoveableElement } from "./MoveableElement";
import { useWindowSize } from "react-use";
import React from "react";
import { formElementsTypes } from "./formElementTypes";

const theme_color_dict: { [theme: string]: { screen: { gameArea: string; formArea: string }; element_panel: { background: string } } } = {
	Light: { screen: { gameArea: "#dddddd", formArea: "#fdfdfd" }, element_panel: { background: "#dddddd" } },
	Dark: { screen: { gameArea: "#303030", formArea: "#a1a1a1" }, element_panel: { background: "#303030" } },
};

//ウィンドウサイズとゲームスクリーンサイズの比を返す関数
function getScale(game_screen_size: { x: number; y: number }, form_size: { x: number; y: number }, elementPanelHeight: number) {
	const window_x = window.innerWidth - 2 - 20; //余分
	const window_y = window.innerHeight - 2 - 50 - 50 - elementPanelHeight - 20; // border + header + toolbar + under + 余分
	if (window_x < 0 || window_y < 0) return 0;
	const max_screen_size_x = Math.max(game_screen_size.x, form_size.x);
	const max_screen_size_y = Math.max(game_screen_size.y, form_size.y);
	const scaleX = window_x / max_screen_size_x;
	const scaleY = window_y / max_screen_size_y;

	const minScale = Math.min(scaleX, scaleY);
	console.log(minScale);
	return Number((minScale * 10).toFixed(1)) * 0.1; //o.oo
}
//フォームエレメントからエレメントパネルの高さを求める関数
function getElementPanelHeight(form_elements: formElementsTypes.elementPropertiesTypes.all[]) {
	return Math.ceil(form_elements.length / Math.floor((window.innerWidth - 20) / 100)) * 100;
}
//スクリーン
const Screen: React.FC<{
	props: {
		formId: String;
		themeColor: "Light" | "Dark";
		formSize: {
			x: number;
			y: number;
		};
		gameScreenSize: {
			x: number;
			y: number;
		};
		screenZoomRatio: number;
		setScreenZoomRatio: React.Dispatch<React.SetStateAction<number>>;
		targetFormElementIndex: number | null;
		setTargetFormElementIndex: React.Dispatch<React.SetStateAction<number | null>>;
		elementPanelHeight: number;
	};
	children: React.ReactNode;
}> = ({ props, children }) => {
	const form_size = {
		x: props.formSize.x * props.screenZoomRatio,
		y: props.formSize.y * props.screenZoomRatio,
	};
	const game_screen_size = {
		x: props.gameScreenSize.x * props.screenZoomRatio,
		y: props.gameScreenSize.y * props.screenZoomRatio,
	};

	return (
		<div
			id="screen"
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				// overflow: "scroll",
				height: `${window.innerHeight - 50 - 50 - props.elementPanelHeight - 20}px`,
				width: `${window.innerWidth - 20}px`,
			}}
		>
			<div
				id="game_screen"
				style={{
					width: `${game_screen_size.x - 2}px`, //ボーダー込みでサイズを設定
					height: `${game_screen_size.y - 2}px`, //ボーダー込みでサイズを設定
					backgroundColor: theme_color_dict[props.themeColor].screen.gameArea,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					border: "solid 1px black",
				}}
			>
				<div
					id="form_screen"
					onClick={() => props.setTargetFormElementIndex(null)}
					style={{
						width: `${form_size.x - 2}px`, //ボーダー込みでサイズを設定
						height: `${form_size.y - 2}px`, //ボーダー込みでサイズを設定
						backgroundColor: theme_color_dict[props.themeColor].screen.formArea,
						border: "solid 1px black",
					}}
				>
					{children}
				</div>
			</div>
		</div>
	);
};

//ヘッダー
const Header: React.FC = () => {
	const header_height = 50 - 1;
	return (
		<div id="header" style={{ width: "100%", height: `${header_height}px`, margin: 0, borderBottom: "solid 1px black", display: "flex", justifyContent: "space-between" }}>
			<div className="title" style={{ margin: "0 0 0 10px" }}>
				<p style={{ margin: 0, fontSize: 36 }}>JUCF-editor</p>
			</div>
			<div className="github_link" style={{ marginLeft: "auto", margin: "0 20px 0 0" }}>
				<a href="https://github.com/Satoyans/JUCF_editor" target="_blank" rel="noopener noreferrer" style={{ margin: 0, lineHeight: `${header_height}px`, fontSize: 20 }}>
					JUCF-editor
				</a>
			</div>
		</div>
	);
};

function createFormElement(): formElementsTypes.elementPropertiesTypes.all {
	return { h: 30, w: 30, x: 0, y: 0, text: "element", texture: "", hover_text: "", is_show_button: false, is_show_close: false, is_show_image: false, is_show_text: true };
}
//ツールバー
const ToolBar: React.FC<{
	props: {
		formElements: formElementsTypes.elementPropertiesTypes.all[];
		setFormElements: React.Dispatch<React.SetStateAction<formElementsTypes.elementPropertiesTypes.all[]>>;
		targetFormElementIndex: number | null;
		setTargetFormElementIndex: React.Dispatch<React.SetStateAction<number | null>>;
	};
}> = ({ props }) => {
	return (
		<div id="toolbar" style={{ width: "100%", height: `${50 - 1}px`, margin: 0, borderBottom: "solid 1px black" }}>
			<div style={{ margin: "0 0 0 10px", display: "flex" }}>
				<p style={{ margin: 0, fontSize: 24 }}>toolbar</p>
				<button
					onClick={() => {
						const form_elements = JSON.parse(JSON.stringify(props.formElements));
						form_elements.push(createFormElement());
						props.setFormElements(form_elements);
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
		</div>
	);
};

//エレメントジェネレーター
const ElementsGenerator: React.FC<{
	props: {
		formElements: formElementsTypes.elementPropertiesTypes.all[];
		setFormElements: React.Dispatch<React.SetStateAction<formElementsTypes.elementPropertiesTypes.all[]>>;
		screenZoomRatio: number;
		setScreenZoomRatio: React.Dispatch<React.SetStateAction<number>>;
		targetFormElementIndex: number | null;
		setTargetFormElementIndex: React.Dispatch<React.SetStateAction<number | null>>;
	};
}> = ({ props }) => {
	function elementGenerator(form_element: formElementsTypes.elementPropertiesTypes.all, index: number) {
		return (
			<div
				id={`form_element${index}`}
				className={`form_element`}
				style={{
					width: `${form_element.w * props.screenZoomRatio - 2}px`,
					height: `${form_element.h * props.screenZoomRatio - 2}px`,
					transform: `translate(${form_element.x * props.screenZoomRatio}px, ${form_element.y * props.screenZoomRatio}px)`,
					position: "absolute",
					letterSpacing: `${-0.75 * props.screenZoomRatio}px`,
					fontSize: `${(10 * props.screenZoomRatio) / 1.2}px`,
					border: `${index === props.targetFormElementIndex ? "solid 1px red" : "solid 1px black"}`,
					zIndex: `${index === props.targetFormElementIndex ? 1 : 0}`,

					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexDirection: "column",
				}}
			>
				{!form_element.is_show_text ? null : (
					<div>
						<p
							style={{
								whiteSpace: "nowrap",
								margin: 0,
								textAlign: "center",
								pointerEvents: "none",
								userSelect: "none",
							}}
						>
							{form_element.text}
						</p>
					</div>
				)}
				{!form_element.is_show_image ? null : (
					<div>
						<img></img>
					</div>
				)}
			</div>
		);
	}
	return (
		<div id="form_elements">
			{props.formElements.map((form_element, index) => (
				<React.Fragment key={index}>{elementGenerator(form_element, index)}</React.Fragment>
			))}
		</div>
	);
};

//エレメントパネル
const ElementPanel: React.FC<{
	props: {
		themeColor: "Light" | "Dark";
		elementPanelHeight: number;
		formElements: formElementsTypes.elementPropertiesTypes.all[];
		targetFormElement: null | HTMLElement;
		setTargetFormElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
		targetFormElementIndex: number | null;
		setTargetFormElementIndex: React.Dispatch<React.SetStateAction<number | null>>;
	};
}> = ({ props }) => {
	const row_count = Math.floor((window.innerWidth - 20) / 100);
	function InPanelElement(form_element: formElementsTypes.elementPropertiesTypes.all, index: number) {
		return (
			<div
				style={{
					width: "80px",
					height: "80px",
					margin: "10px",

					display: "flex",
					justifyContent: " center",
					alignItems: "center",
					border: `${index === props.targetFormElementIndex ? "solid 1px red" : "solid 1px black"}`,
				}}
				id={`in_panel_element${index}`}
				onClick={(e) => {
					const form_element_index = Number((e.target as HTMLDivElement).id.replace("in_panel_element", ""));
					if (Number.isNaN(form_element_index)) throw new Error("element_panel_index is not a number!");
					props.setTargetFormElementIndex(form_element_index);
				}}
			>
				<p
					style={{
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
						margin: 0,
						pointerEvents: "none",
						userSelect: "none",
					}}
				>
					{form_element.text}
				</p>
				<img></img>
			</div>
		);
	}
	return (
		<div
			id="element_panel"
			style={{
				backgroundColor: theme_color_dict[props.themeColor].element_panel.background,
				width: "100%",
				height: `${props.elementPanelHeight}px`,
				display: "flex",
				flexFlow: "wrap",
			}}
		>
			{props.formElements.map((form_element, index) => (
				<React.Fragment key={index}>{InPanelElement(form_element, index)}</React.Fragment>
			))}
		</div>
	);
};

function App() {
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

	//フォームエレメント更新時にエレメントパネルの高さ更新
	useEffect(() => setElementPanelHeight(getElementPanelHeight(formElements)), [formElements]);

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

	return (
		<div className="App">
			<Header />
			<ToolBar props={{ formElements, setFormElements, setTargetFormElementIndex, targetFormElementIndex }} />
			<Screen
				props={{ formId, themeColor, gameScreenSize, formSize, screenZoomRatio, setScreenZoomRatio, targetFormElementIndex, setTargetFormElementIndex, elementPanelHeight }}
			>
				<ElementsGenerator props={{ formElements, setFormElements, screenZoomRatio, setScreenZoomRatio, targetFormElementIndex, setTargetFormElementIndex }} />
				<MoveableElement props={{ targetFormElement, setTargetFormElement, screenZoomRatio, formSize, gameScreenSize, formElements, setFormElements }} />
			</Screen>
			<ElementPanel props={{ themeColor, elementPanelHeight, formElements, targetFormElement, setTargetFormElement, targetFormElementIndex, setTargetFormElementIndex }} />
			<div id="dev_info" /*style={{ maxHeight: "100px" }}*/>
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
				{/*TODO Inputにして入力でもzoomできるようにする*/}
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
			</div>
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
		</div>
	);
}

export default App;
