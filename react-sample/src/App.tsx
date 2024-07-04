import { useState } from "react";
import { default as MoveableElement } from "./MoveableElement";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import React from "react";

type screenSizeStatesType = {
	screenSizeState: {
		x: number;
		y: number;
	};
	setScreenSizeState: React.Dispatch<
		React.SetStateAction<{
			x: number;
			y: number;
		}>
	>;
};

//スクリーン
const Screen: React.FC<{ screenSizeStates: screenSizeStatesType; children: React.ReactNode }> = ({ screenSizeStates, children }) => {
	const border_style = {
		border: "solid 1px",
	};
	return (
		<div id="outer_screen" style={{ ...border_style, height: "50vh", width: "calc( 100% - 10px )", margin: "0 5px" }}>
			<div id="screen" style={{ ...border_style, margin: "4px", height: "calc(50vh - 10px)", width: "calc(100% - 10px)" }}>
				<div>
					<p>{screenSizeStates.screenSizeState.x}</p>
					<p>{screenSizeStates.screenSizeState.y}</p>
				</div>
				{children}
			</div>
		</div>
	);
};

//ヘッダー
const Header: React.FC = () => {
	return <div></div>;
};

function App() {
	const [screenSizeState, setScreenSizeState] = useState({ x: 300, y: 200 });
	const screenSizeStates = { screenSizeState, setScreenSizeState };

	setTimeout(() => {
		setScreenSizeState({ x: 20, y: 20 });
	}, 1000);
	return (
		<div className="App">
			<Header />
			<Screen screenSizeStates={screenSizeStates}>
				<p className="moveable">移動可能要素のはず</p>
				<MoveableElement />
			</Screen>
		</div>
	);
}

export default App;
