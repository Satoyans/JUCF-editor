import { formElementsTypes } from "../../formElementTypes";
import { propsType } from "../../propsType";
import { ControlPanel } from "./ControlPanel";
import { ElementPanel } from "./ElementPanel";
import { ElementsGenerator } from "./ElementsGenerator";
import MoveableElement from "./MoveableElement";
import { Output } from "./Output";
import { Screen } from "./Screen";

export const ScreenTab: React.FC<{
	props: propsType;
}> = ({ props }) => {
	return (
		<>
			<div style={{ display: "flex", flexDirection: "row", borderBottom: "solid 1px black" }}>
				<Screen props={{ ...props }}>
					<ElementsGenerator props={{ ...props }} />
					<MoveableElement props={{ ...props }} />
				</Screen>
				<ControlPanel props={{ ...props }} />
			</div>
			<ElementPanel props={{ ...props }} />
			<Output props={{ ...props }} />
		</>
	);
};
