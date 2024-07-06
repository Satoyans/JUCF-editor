import { useEffect, useState } from "react";
import { default as MoveableElement } from "./MoveableElement";
import { useWindowSize } from "react-use";
import React from "react";

const theme_color_dict: { [theme: string]: { screen: { gameArea: string; formArea: string } } } = {
	Light: { screen: { gameArea: "#dddddd", formArea: "#fdfdfd" } },
	Dark: { screen: { gameArea: "#303030", formArea: "#a1a1a1" } },
};

//ウィンドウサイズとゲームスクリーンサイズの比を返す関数
function getScale(game_screen_size: { x: number; y: number }, form_size: { x: number; y: number }) {
	const window_x = window.innerWidth - 2;
	const window_y = window.innerHeight - 2 - 50 - 50 - 100; // border + header + toolbar + under
	if (window_x < 0 || window_y < 0) return 0;
	const max_screen_size_x = Math.max(game_screen_size.x, form_size.x);
	const max_screen_size_y = Math.max(game_screen_size.y, form_size.y);
	const scaleX = window_x / max_screen_size_x;
	const scaleY = window_y / max_screen_size_y;

	const minScale = Math.min(scaleX, scaleY);
	return Number((minScale * 10).toFixed(1)) * 0.1; //o.oo
}
//スクリーン
const Screen: React.FC<{
	formIdState: String;
	themeColorState: "Light" | "Dark";
	formSizeState: {
		x: number;
		y: number;
	};
	gameScreenSizeState: {
		x: number;
		y: number;
	};
	screenZoomRatio: number;
	setScreenZoomRatio: React.Dispatch<React.SetStateAction<number>>;
	children: React.ReactNode;
}> = ({ formSizeState, gameScreenSizeState, formIdState, themeColorState, screenZoomRatio, setScreenZoomRatio, children }) => {
	const border_style = {
		border: "solid 1px",
	};

	const scale = getScale(gameScreenSizeState, formSizeState);
	const form_size = { x: formSizeState.x * scale * screenZoomRatio, y: formSizeState.y * scale * screenZoomRatio };
	const game_screen_size = { x: gameScreenSizeState.x * scale * screenZoomRatio, y: gameScreenSizeState.y * scale * screenZoomRatio };

	return (
		<div
			id="screen"
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<div
				id="game_screen"
				style={{
					...border_style,
					width: `${game_screen_size.x}px`,
					height: `${game_screen_size.y}px`,
					backgroundColor: theme_color_dict[themeColorState].screen.gameArea,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<div
					id="form_screen"
					style={{
						...border_style,
						width: `${form_size.x}px`,
						height: `${form_size.y}px`,
						backgroundColor: theme_color_dict[themeColorState].screen.formArea,
					}}
				>
					<div></div>
					{children}
				</div>
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
	//State: サイトのテーマカラー
	const [themeColorState, setThemeColorState] = useState<"Light" | "Dark">("Light");
	//State: ゲームスクリーンサイズ
	const [gameScreenSizeState, setGameScreenSizeState] = useState({ x: 450, y: 180 });
	//State: フォームサイズ
	const [formSizeState, setFormSizeState] = useState({ x: 300, y: 180 });
	//State: スケール
	const [scaleState, setScaleState] = useState(getScale(gameScreenSizeState, formSizeState));
	//State: フォームid
	const [FormIdState, setFormIdState] = useState("custom_form");
	//State: ターゲットエレメント
	const [targetElement, setTargetElement] = useState<null | HTMLElement>(null);
	//State: ズーム倍率
	const [screenZoomRatio, setScreenZoomRatio] = useState(1);

	//初回またはターゲット要素変更時にMoveableのtarget更新
	useEffect(() => {
		setTargetElement(document.querySelector(".moveable") as HTMLElement);
	}, [targetElement]);

	//ウィンドウサイズ変更時に実行
	window.onresize = () => {
		const update_scale = getScale(gameScreenSizeState, formSizeState);
		if (Math.abs(update_scale - scaleState) < 0.05) return;
		setScaleState(update_scale);
	};

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
			<ToolBar />
			<div id="dev_info" style={{ maxHeight: "100px" }}>
				<p>
					window:{window.innerWidth}/{window.innerHeight}
				</p>
				<p>
					game:{gameScreenSizeState.x}/{gameScreenSizeState.y}
				</p>
				<p>
					form:{formSizeState.x}/{formSizeState.y}
				</p>
				{/*TODO Inputにして入力でもzoomできるようにする*/}
				<p>zoom:{(screenZoomRatio * 100).toFixed(0)}%</p>
				<div>
					<button type="button" onClick={(e) => updateZoomRatio(-10)}>
						{"<<"}
					</button>
					<button type="button" onClick={(e) => updateZoomRatio(-5)}>
						{"<"}
					</button>
					<button type="button" onClick={(e) => updateZoomRatio(5)}>
						{">"}
					</button>
					<button type="button" onClick={(e) => updateZoomRatio(10)}>
						{">>"}
					</button>
				</div>
			</div>
			<Screen
				formIdState={FormIdState}
				themeColorState={themeColorState}
				gameScreenSizeState={gameScreenSizeState}
				formSizeState={formSizeState}
				screenZoomRatio={screenZoomRatio}
				setScreenZoomRatio={setScreenZoomRatio}
			>
				<div className="moveable" style={{ margin: "0", border: "solid 1px" }}>
					<p style={{ whiteSpace: "pre-wrap", textAlign: "center" }}>{"移動可能要素のはず"}</p>
				</div>
				{/*TODO 操作できる要素を生成する関数か何かを書く*/}
				<MoveableElement targetElement={targetElement} setTargetElement={setTargetElement} />
			</Screen>
		</div>
	);
}

export default App;
