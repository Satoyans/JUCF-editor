import { useEffect, useState } from "react";
import { default as MoveableElement } from "./MoveableElement";
import React from "react";

const theme_color_dict: { [theme: string]: { screen: { gameArea: string; formArea: string } } } = {
	Light: { screen: { gameArea: "#dddddd", formArea: "#fdfdfd" } },
	Dark: { screen: { gameArea: "#303030", formArea: "#a1a1a1" } },
};

//ゲームスクリーンサイズ or フォームサイズが変更された時に実行するタイプのやつ
function calclWindowScreenSize(
	game_screen_size: { x: number; y: number },
	form_size: { x: number; y: number },
	screenZoomRatio: number,
	setScreenZoomRatio: React.Dispatch<React.SetStateAction<number>>
) {
	const window_raw_x = window.innerWidth;
	const window_raw_y = window.innerHeight;
	const window_x = window_raw_x - 2;
	const window_y = window_raw_y - 50 - 50; //Header,Toolbar

	//ゲームとwindowの比率

	const max_screen_size_x = Math.max(game_screen_size.x, form_size.x);
	const max_screen_size_y = Math.max(game_screen_size.y, form_size.y);

	const width_ratio = Number(((window_x / max_screen_size_x) * 10).toFixed(1)) * 0.1; //o.oo
	return {
		screenZoomRatio: width_ratio,
		game_screen_size: {
			x: game_screen_size.x * width_ratio * screenZoomRatio,
			y: game_screen_size.y * width_ratio * screenZoomRatio,
		},
		form_size: {
			x: form_size.x * width_ratio * screenZoomRatio,
			y: form_size.y * width_ratio * screenZoomRatio,
		},
	};
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
	const can_use_screen_width = window.innerWidth - 10; //margin
	const can_use_screen_height = window.innerHeight - (50 + 50 + 10); //ヘッダー + 下の要素 + margin
	if (can_use_screen_width < 0 || can_use_screen_height < 0) return <p>画面サイズエラー</p>;

	const { form_size, game_screen_size } = calclWindowScreenSize(gameScreenSizeState, formSizeState, screenZoomRatio, setScreenZoomRatio);

	return (
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
	//State: フォームid
	const [FormIdState, setFormIdState] = useState("custom_form");
	//State: ターゲットエレメント
	const [targetElement, setTargetElement] = useState<null | HTMLElement>(null);
	//State: スクリーン倍率
	const [screenZoomRatio, setScreenZoomRatio] = useState(1);

	//初回またはターゲット要素変更時にMoveableのtarget更新
	useEffect(() => {
		setTargetElement(document.querySelector(".moveable") as HTMLElement);
	}, [targetElement]);
	return (
		<div className="App">
			<Header />
			<ToolBar />
			<Screen
				formIdState={FormIdState}
				themeColorState={themeColorState}
				gameScreenSizeState={gameScreenSizeState}
				formSizeState={formSizeState}
				screenZoomRatio={screenZoomRatio}
				setScreenZoomRatio={setScreenZoomRatio}
			>
				<p className="moveable" style={{ margin: "0", border: "solid 1px" }}>
					移動可能要素のはず
				</p>
				<MoveableElement targetElement={targetElement} setTargetElement={setTargetElement} />
			</Screen>
			<div id="dev_info">
				<p>
					window:{window.innerWidth}/{window.innerHeight}
				</p>
				<p>
					game:{gameScreenSizeState.x}/{gameScreenSizeState.y}
				</p>
				<p>
					form:{formSizeState.x}/{formSizeState.y}
				</p>
				<p>zoom:{(screenZoomRatio * 100).toFixed(0)}%</p>
				<div>
					<button type="button" onClick={(e) => setScreenZoomRatio(screenZoomRatio - 0.05)}>
						{"<<"}
					</button>
					<button type="button" onClick={(e) => setScreenZoomRatio(screenZoomRatio - 0.1)}>
						{"<"}
					</button>
					<button type="button" onClick={(e) => setScreenZoomRatio(screenZoomRatio + 0.05)}>
						{">"}
					</button>
					<button type="button" onClick={(e) => setScreenZoomRatio(screenZoomRatio + 0.1)}>
						{">>"}
					</button>
				</div>
			</div>
		</div>
	);
}

export default App;
