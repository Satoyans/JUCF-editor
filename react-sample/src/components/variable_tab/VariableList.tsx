import React, { useEffect, useRef, useState } from "react";
import { themeColors } from "../themeColor";
import { propsType } from "../../propsType";

export const VariableList: React.FC<{
	props: {
		variable: propsType["variable"];
		setVariable: propsType["setVariable"];
		themeColor: propsType["themeColor"];
	};
}> = ({ props }) => {
	const [editVariableKey, setEditVariableKey] = useState<string | null>(null);
	const ref_key = useRef<HTMLInputElement>(null!);
	const ref_value = useRef<HTMLInputElement>(null!);
	useEffect(() => {
		if (!editVariableKey) return;
		const key = editVariableKey.replace("variable_", "");
		const value = props.variable[key];
		ref_key.current.value = key;
		ref_value.current.value = String(value);
	}, [editVariableKey]);

	useEffect(() => {
		setEditVariableKey(null);
	}, [Object.keys(props.variable).length]);

	return (
		<>
			{Object.keys(props.variable)
				.sort((a, b) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1))
				.map((key, i) => (
					<React.Fragment key={i}>
						<div
							id={`variable_${key}`}
							style={{
								margin: "5px",
								marginBottom: 0,
								height: "30px",
								border: "solid 1px black",
								backgroundColor: themeColors[props.themeColor].variable_panel.background,
								display: "flex",
								justifyContent: "space-between",
							}}
						>
							{editVariableKey === `variable_${key}` ? (
								<div style={{ margin: "3px 10px", width: "60%", display: "flex", flexDirection: "row", height: "24px" }}>
									<span style={{ margin: 0, display: "flex", alignItems: "center" }}>%</span>
									<input ref={ref_key}></input>
									<span style={{ margin: 0, display: "flex", alignItems: "center" }}>%</span>
									<span style={{ margin: "0 10px", display: "flex", alignItems: "center" }}>⇒</span>
									<input ref={ref_value}></input>
									<button
										onClick={(e) => {
											const new_key = ref_key.current.value;
											const new_value = ref_value.current.value;

											const target = e.target as HTMLButtonElement;
											const id = target.parentElement!.parentElement!.id;

											const old_key = id.replace("variable_", "");
											const old_value = props.variable[old_key];

											if (new_key === "") return;
											if (new_key !== old_key && props.variable[new_key] !== undefined) return alert(`キー"${new_key}"は既に使用されています。`);

											//新しいオブジェクトとして作成
											const new_variable = { ...props.variable };
											delete new_variable[old_key];
											new_variable[new_key] = new_value;
											props.setVariable(new_variable);
											setEditVariableKey(null);
										}}
									>
										更新
									</button>
								</div>
							) : (
								<div style={{ margin: "0 10px", width: "60%", display: "flex", flexDirection: "row" }}>
									<span style={{ display: "flex", alignItems: "center" }}>%{key}%</span>
									<span style={{ margin: "0 10px", display: "flex", alignItems: "center" }}>⇒</span>
									<span style={{ display: "flex", alignItems: "center" }}>{String(props.variable[key])}</span>
								</div>
							)}

							<div className="edit_button" style={{ margin: "5px", display: "flex", alignItems: "center" }}>
								<button
									style={{ width: "25px", height: "25px", display: "flex", justifyContent: "center", alignItems: "center", margin: "10px 5px" }}
									onClick={(e) => {
										const target = e.target as HTMLButtonElement;
										const id = target.parentElement!.parentElement!.id;
										if (editVariableKey === id) return setEditVariableKey(null);
										setEditVariableKey(id);
									}}
								>
									<a style={{ fontSize: "18px", userSelect: "none", pointerEvents: "none" }}>🖋</a>
								</button>
								<button
									style={{ width: "25px", height: "25px", display: "flex", justifyContent: "center", alignItems: "center", margin: "10px 5px" }}
									onClick={(e) => {
										const target = e.target as HTMLButtonElement;
										const id = target.parentElement!.parentElement!.id;
										const delete_key = id.replace("variable_", "");
										const new_variable = { ...props.variable };
										delete new_variable[delete_key];
										props.setVariable(new_variable);
									}}
								>
									<a style={{ fontSize: "18px", userSelect: "none", pointerEvents: "none" }}>🗑</a>
								</button>
							</div>
						</div>
					</React.Fragment>
				))}
		</>
	);
};
