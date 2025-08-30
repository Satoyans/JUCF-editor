import { propsType } from "../../propsType";
import { themeColors } from "../themeColor";

//スクリーン
export const Screen: React.FC<{
	props: {
		themeColor: propsType["themeColor"];
		formSize: propsType["formSize"];
		gameScreenSize: propsType["gameScreenSize"];
		screenZoomRatio: propsType["screenZoomRatio"];
		setScreenZoomRatio: propsType["setScreenZoomRatio"];
		targetFormElementIndex: propsType["targetFormElementIndex"];
		setTargetFormElementIndex: propsType["setTargetFormElementIndex"];
		elementPanelHeight: propsType["elementPanelHeight"];
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
				//display: "flex",
				//justifyContent: "center",
				//alignItems: "center",
				//flexShrink: 0,
				overflow: "auto",
				maxHeight: `${window.innerHeight - 50 - 50 - props.elementPanelHeight - 20}px`,
				width: `${window.innerWidth - 20 - 200}px`,
			}}
		>
			<div
				id="game_screen"
				style={{
					width: `${game_screen_size.x}px`,
					height: `${game_screen_size.y}px`,
					backgroundColor: themeColors[props.themeColor].screen.gameArea,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					// flexShrink: 0,
					// margin: "auto",
					boxShadow: "0 0 0 1px black inset",
				}}
			>
				<div
					id="form_screen"
					onClick={() => props.setTargetFormElementIndex(null)}
					style={{
						width: `${form_size.x}px`,
						height: `${form_size.y}px`,
						backgroundColor: themeColors[props.themeColor].screen.formArea,
						// display: "flex",
						// justifyContent: "center",
						// alignItems: "center",
						// flexShrink: 0,
						margin: "auto",
						boxShadow: "0 0 0 1px black inset",
					}}
				>
					{children}
				</div>
			</div>
		</div>
	);
};
