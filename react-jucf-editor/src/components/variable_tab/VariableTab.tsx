import { propsType } from "../../propsType";
import { VariableInput } from "./VariableInput";
import { VariableList } from "./VariableList";

export const VariableTab: React.FC<{ props: propsType }> = ({ props }) => (
	<>
		<VariableInput props={{ ...props }} />
		<VariableList props={{ ...props }} />
	</>
);
