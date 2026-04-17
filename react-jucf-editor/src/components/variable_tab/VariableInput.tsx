import { useAppContext } from "../../AppContext";

export const VariableInput: React.FC = () => {
	const { variable, setVariable } = useAppContext();
	return (
		<div style={{ margin: "5px", marginBottom: "10px", height: "40px", border: "solid 2px black", display: "flex", alignItems: "center", justifyContent: "center" }}>
			<input id="variable_input_key" style={{ width: "20%", height: "20px", margin: "5px" }} type="text" autoComplete="off" />
			<span>:</span>
			<input id="variable_input_value" style={{ width: "20%", height: "20px", margin: "5px" }} type="text" autoComplete="off" />
			<button
				style={{ width: "60px" }}
				onClick={(e) => {
					const inputKeyInput = document.querySelector("#variable_input_key")! as HTMLInputElement;
					const inputValueInput = document.querySelector("#variable_input_value")! as HTMLInputElement;

					const inputKey = inputKeyInput.value;
					const inputValue = inputValueInput.value;
					if (inputKey === "") return;
					if (variable[inputKey] !== undefined) return;
					setVariable({ ...variable, [inputKey]: inputValue });

					//リセット
					inputKeyInput.value = "";
					inputValueInput.value = "";
				}}
			>
				追加
			</button>
		</div>
	);
};
