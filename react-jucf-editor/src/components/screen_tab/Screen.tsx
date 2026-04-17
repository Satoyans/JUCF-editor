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
	} = useAppContext();

	const scaledFormSize = {
		x: formSize.x * screenZoomRatio,
		y: formSize.y * screenZoomRatio,
	};
	const scaledGameScreenSize = {
		x: gameScreenSize.x * screenZoomRatio,
		y: gameScreenSize.y * screenZoomRatio,
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
					boxShadow: themeColor === "Dark" ? "0 10px 40px rgba(0, 0, 0, 0.5)" : "0 10px 40px rgba(0, 0, 0, 0.15)",
                    borderRadius: "4px"
				}}
			>
				<div
					id="form_screen"
					onClick={() => setTargetFormElementIndex(null)}
					style={{
						width: `${scaledFormSize.x}px`,
						height: `${scaledFormSize.y}px`,
						backgroundColor: themeColors[themeColor].screen.formArea,
						margin: "auto",
						border: themeColor === "Dark" ? "2px dashed rgba(255, 255, 255, 0.2)" : "2px dashed rgba(0, 0, 0, 0.2)",
                        boxShadow: themeColor === "Dark" ? "0 4px 20px rgba(0, 0, 0, 0.3)" : "0 4px 20px rgba(0, 0, 0, 0.1)",
                        borderRadius: "2px"
					}}
				>
					{children}
				</div>
			</div>
		</div>
	);
};
