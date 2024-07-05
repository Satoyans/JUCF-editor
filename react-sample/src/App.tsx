import { useEffect, useState } from "react";
import { default as MoveableElement } from "./MoveableElement";
import React from "react";

//スクリーン
const Screen: React.FC<{
	formSizeState: {
		x: number;
		y: number;
	};
	setFormSizeState: React.Dispatch<
		React.SetStateAction<{
			x: number;
			y: number;
		}>
	>;
	formIdState: String;
	children: React.ReactNode;
}> = ({ formSizeState, formIdState, children }) => {
	//フォームのidがないなら隠す
	if (formIdState === "") return <></>;

	const border_style = {
		border: "solid 1px",
	};
	const can_use_screen_width = window.innerWidth - 10; //margin
	const can_use_screen_height = window.innerHeight - (50 + 50 + 10); //ヘッダー + 下の要素 + margin
	if (can_use_screen_width < 0 || can_use_screen_height < 0) return <p>画面サイズエラー</p>;

	return (
		<div id="outer_screen" style={{ ...border_style, height: "50vh", width: "calc( 100% - 10px )", margin: "0 5px" }}>
			<div id="screen" style={{ ...border_style, margin: "4px", height: "calc(50vh - 10px)", width: "calc(100% - 10px)" }}>
				<div></div>
				{children}
			</div>
		</div>
	);
};

//ヘッダー
const Header: React.FC = () => {
	const header_height = 50;
	return (
		<div id="header" style={{ width: "100%", height: `${header_height}px`, margin: 0, borderBottom: "solid 1px", display: "flex", justifyContent: "space-between" }}>
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

//ツールバー
const ToolBar: React.FC = () => {
	return (
		<div id="toolbar" style={{ width: "100%", height: "50px", margin: 0, borderBottom: "solid 1px" }}>
			<div style={{ margin: "0 0 0 10px" }}>
				<p style={{ margin: 0, fontSize: 24 }}>toolbar</p>
			</div>
		</div>
	);
};

function App() {
	//State: フォームサイズ
	const [formSizeState, setFormSizeState] = useState({ x: 300, y: 200 });
	//State: ゲームスクリーンサイズ
	const [gameScreenSizeState, setGameScreenSizeState] = useState({ x: 300, y: 200 });
	//State: フォームid
	const [FormIdState, setFormIdState] = useState("test"); //TODO id設定画面を作る
	//State: ターゲットエレメント
	const [targetElement, setTargetElement] = useState<null | HTMLElement>(null);

	//初回またはターゲット要素変更時にMoveableのtarget更新
	useEffect(() => {
		setTargetElement(document.querySelector(".moveable") as HTMLElement);
	}, [targetElement]);
	return (
		<div className="App">
			<Header />
			<ToolBar />
			<Screen formSizeState={formSizeState} setFormSizeState={setFormSizeState} formIdState={FormIdState}>
				<p className="moveable">移動可能要素のはず</p>
				<MoveableElement targetElement={targetElement} setTargetElement={setTargetElement} />
			</Screen>
			<p>
				{window.innerWidth}/{window.innerHeight}
			</p>
		</div>
	);
}

export default App;
