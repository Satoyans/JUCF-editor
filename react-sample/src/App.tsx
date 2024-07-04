import { useEffect, useState } from "react";
import { default as MoveableElement } from "./MoveableElement";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
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
}> = ({ formSizeState, setFormSizeState, formIdState, children }) => {
	//フォームのidがないなら隠す
	if (formIdState === "") return <></>;

	const border_style = {
		border: "solid 1px",
	};
	return (
		<div id="outer_screen" style={{ ...border_style, height: "50vh", width: "calc( 100% - 10px )", margin: "0 5px" }}>
			<div id="screen" style={{ ...border_style, margin: "4px", height: "calc(50vh - 10px)", width: "calc(100% - 10px)" }}>
				<div>
					<p>{formSizeState.x}</p>
					<p>{formSizeState.y}</p>
				</div>
				{children}
			</div>
		</div>
	);
};

//ヘッダー
const Header: React.FC = () => {
	return (
		<div id="header" style={{ width: "100%", height: "50px", margin: 0, borderBottom: "solid 1px" }}>
			<div className="title" style={{ margin: "0 0 0 10px" }}>
				<p style={{ margin: 0, fontSize: 36 }}>JUCF-editor</p>
			</div>
		</div>
	);
};

function App() {
	//フォームサイズ
	const [formSizeState, setFormSizeState] = useState({ x: 300, y: 200 });
	//フォームid
	const [FormIdState, setFormIdState] = useState("");
	//ターゲットエレメント
	const [targetElement, setTargetElement] = useState<null | HTMLElement>(null);

	useEffect(() => {
		setTargetElement(document.querySelector(".moveable") as HTMLElement);
	}, [targetElement]);
	setTimeout(() => {
		setFormSizeState({ x: 20, y: 20 });
	}, 1000);
	return (
		<div className="App">
			<Header />
			<p>
				{window.innerWidth}/{window.innerHeight}
			</p>
			<Screen formSizeState={formSizeState} setFormSizeState={setFormSizeState} formIdState={FormIdState}>
				<p className="moveable">移動可能要素のはず</p>
				<MoveableElement targetElement={targetElement} setTargetElement={setTargetElement} />
			</Screen>
		</div>
	);
}

export default App;
