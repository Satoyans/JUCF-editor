import { ControlPanel } from "./ControlPanel";
import { ElementPanel } from "./ElementPanel";
import { ElementsGenerator } from "./ElementsGenerator";
import MoveableElement from "./MoveableElement";
import { Output } from "./Output";
import { Screen } from "./Screen";

export const ScreenTab: React.FC = () => {
	return (
		<>
			<div style={{ display: "flex", flexDirection: "row", borderBottom: "solid 1px black" }}>
				<Screen>
					<ElementsGenerator />
					<MoveableElement />
				</Screen>
				<ControlPanel />
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
