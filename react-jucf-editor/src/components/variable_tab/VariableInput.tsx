import { propsType } from "../../propsType";

export const VariableInput: React.FC<{
	props: {
		variable: propsType["variable"];
		setVariable: propsType["setVariable"];
	};
}> = ({ props }) => {
	return (
		<div style={{ margin: "5px", marginBottom: "10px", height: "40px", border: "solid 2px black", display: "flex", alignItems: "center", justifyContent: "center" }}>
			<input id="variable_input_key" style={{ width: "20%", height: "20px", margin: "5px" }} type="text" autoComplete="off" />
			<span>:</span>
			<input id="variable_input_value" style={{ width: "20%", height: "20px", margin: "5px" }} type="text" autoComplete="off" />
			<button
				style={{ width: "60px" }}
				onClick={(e) => {
					const input_key_input = document.querySelector("#variable_input_key")! as HTMLInputElement;
					const input_value_input = document.querySelector("#variable_input_value")! as HTMLInputElement;

					const input_key = input_key_input.value;
					const input_value = input_value_input.value;
					if (input_key === "") return;
					if (props.variable[input_key] !== undefined) return;
					props.setVariable({ ...props.variable, [input_key]: input_value });

					//リセット
					input_key_input.value = "";
					input_value_input.value = "";
				}}
			>
				追加
			</button>
		</div>
	);
};
