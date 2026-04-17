import { themeColors } from "../themeColor";
import { useAppContext } from "../../AppContext";

//スクリーン
export const Screen: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const {
		themeColor,
		formSize,
		gameScreenSize,
		screenZoomRatio,
		setTargetFormElementIndex,
		elementPanelHeight,
		isShowFormFrame,
	} = useAppContext();

	const scaledFormSize = {
		x: formSize.x * screenZoomRatio,
		y: formSize.y * screenZoomRatio,
	};
	const scaledGameScreenSize = {
		x: gameScreenSize.x * screenZoomRatio,
		y: gameScreenSize.y * screenZoomRatio,
	};

	const isNineSlice = isShowFormFrame === "true";
	const s = screenZoomRatio;

	const formScreenStyle: React.CSSProperties = {
		width: "100%",
		height: "100%",
		backgroundColor: themeColors[themeColor].screen.formArea,
		border: themeColor === "Dark" ? "2px dashed rgba(255, 255, 255, 0.2)" : "2px dashed rgba(0, 0, 0, 0.2)",
		boxShadow: isNineSlice ? "none" : (themeColor === "Dark" ? "0 4px 20px rgba(0, 0, 0, 0.3)" : "0 4px 20px rgba(0, 0, 0, 0.1)"),
		borderRadius: "2px",
		position: "relative"
	};

	return (
		<div
			id="screen"
			style={{
				overflow: "auto",
				maxHeight: `${window.innerHeight - 50 - 50 - elementPanelHeight - 20}px`,
				flexGrow: 1,
			}}
		>
			<div
				id="game_screen"
				style={{
					margin: "0 auto",
					width: `${scaledGameScreenSize.x}px`,
					height: `${scaledGameScreenSize.y}px`,
					backgroundColor: themeColors[themeColor].screen.gameArea,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					overflow: "hidden", // 追加：game_screen外部にはみ出たものを隠す
					boxShadow: themeColor === "Dark" ? "0 10px 40px rgba(0, 0, 0, 0.5)" : "0 10px 40px rgba(0, 0, 0, 0.15)",
                    borderRadius: "4px"
				}}
			>
				<div
					id="form_screen_wrapper"
					style={{
						width: `${scaledFormSize.x}px`,
						height: `${scaledFormSize.y}px`,
						margin: "auto",
						position: "relative"
					}}
				>
					{/* 見た目だけの枠線（レイアウトに一切影響を与えない） */}
					{isNineSlice && (
						<div style={{
							position: "absolute",
							top: `-${23 * s}px`,
							bottom: `-${8 * s}px`,
							left: `-${8 * s}px`,
							right: `-${8 * s}px`,
							pointerEvents: "none",
							borderImageSource: `url('${process.env.PUBLIC_URL}/img/form_background.png')`,
							borderImageSlice: "23 8 8 8",
							borderWidth: `${23 * s}px ${8 * s}px ${8 * s}px ${8 * s}px`,
							borderStyle: "solid"
						}} />
					)}

					<div
						id="form_screen"
						onClick={() => setTargetFormElementIndex(null)}
						style={formScreenStyle}
					>
						{children}
					</div>
				</div>
			</div>
		</div>
	);
};
