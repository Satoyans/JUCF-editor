import { useAppContext } from "../../AppContext";

export const VariableInput: React.FC = () => {
	const { variable, setVariable } = useAppContext();
	return (
		<div style={{ margin: "5px", marginBottom: "10px", height: "45px", border: "solid 1px #d1d5db", borderRadius: "6px", backgroundColor: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center" }}>
			<input id="variable_input_key" style={{ width: "30%", height: "24px", margin: "5px", border: "1px solid #d1d5db", borderRadius: "4px", padding: "0 6px" }} type="text" autoComplete="off" placeholder="key" />
			<span style={{ margin: "0 4px", color: "#6b7280" }}>:</span>
			<input id="variable_input_value" style={{ width: "30%", height: "24px", margin: "5px", border: "1px solid #d1d5db", borderRadius: "4px", padding: "0 6px" }} type="text" autoComplete="off" placeholder="value" />
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
