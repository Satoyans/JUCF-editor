import { useState } from "react";
import { ControlPanel } from "./ControlPanel";
import { ElementPanel } from "./ElementPanel";
import { ElementsGenerator } from "./ElementsGenerator";
import MoveableElement from "./MoveableElement";
import { Output } from "./Output";
import { Screen } from "./Screen";
import { ScreenToolBar } from "./ScreenToolBar";
import { useAppContext } from "../../AppContext";

export const ScreenTab: React.FC = () => {
	const { isShowControlPanel, setIsShowControlPanel } = useAppContext();

	return (
		<>
			<div style={{ display: "flex", flexDirection: "row", borderBottom: "solid 1px black", position: "relative" }}>
				<ScreenToolBar />
				<Screen>
					<ElementsGenerator />
					<MoveableElement />
				</Screen>
				{isShowControlPanel && <ControlPanel />}
				<button
					onClick={() => setIsShowControlPanel(!isShowControlPanel)}
					style={{
						position: "absolute",
						right: isShowControlPanel ? 220 : 0,
						top: 0,
						width: "20px",
						height: "40px",
						zIndex: 10,
						cursor: "pointer",
					}}
					title={isShowControlPanel ? "コントロールパネルを隠す" : "コントロールパネルを開く"}
				>
					{isShowControlPanel ? ">" : "<"}
				</button>
			</div>
			<ElementPanel />
			<Output />
			<div>
				<span>バグ報告は</span>
				<a href="https://github.com/Satoyans/JUCF_editor">Github</a>
				<span>もしくはDiscord@satoyan_まで!</span>
			</div>
		</>
	);
};
