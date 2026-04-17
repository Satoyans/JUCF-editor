import React, { useEffect, useRef, useState } from "react";
import { themeColors } from "../themeColor";
import { useAppContext } from "../../AppContext";

export const VariableList: React.FC = () => {
	const { variable, setVariable, themeColor } = useAppContext();
	const [editVariableKey, setEditVariableKey] = useState<string | null>(null);
	const refKey = useRef<HTMLInputElement>(null!);
	const refValue = useRef<HTMLInputElement>(null!);
	useEffect(() => {
		if (!editVariableKey) return;
		const key = editVariableKey.replace("variable_", "");
		const value = variable[key];
		refKey.current.value = key;
		refValue.current.value = String(value);
	}, [editVariableKey, variable]);

	useEffect(() => {
		setEditVariableKey(null);
	}, [Object.keys(variable).length]);

	return (
		<>
			{Object.keys(variable)
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
								backgroundColor: themeColors[themeColor].variable_panel.background,
								display: "flex",
								justifyContent: "space-between",
							}}
						>
							{editVariableKey === `variable_${key}` ? (
								<div style={{ margin: "3px 10px", width: "60%", display: "flex", flexDirection: "row", height: "24px" }}>
									<span style={{ margin: 0, display: "flex", alignItems: "center" }}>%</span>
									<input ref={refKey}></input>
									<span style={{ margin: 0, display: "flex", alignItems: "center" }}>%</span>
									<span style={{ margin: "0 10px", display: "flex", alignItems: "center" }}>⇒</span>
									<input ref={refValue}></input>
									<button
										onClick={(e) => {
											const newKey = refKey.current.value;
											const newValue = refValue.current.value;

											const target = e.target as HTMLButtonElement;
											const id = target.parentElement!.parentElement!.id;

											const oldKey = id.replace("variable_", "");

											if (newKey === "") return;
											if (newKey !== oldKey && variable[newKey] !== undefined) return alert(`キー"${newKey}"は既に使用されています。`);

											//新しいオブジェクトとして作成
											const newVariable = { ...variable };
											delete newVariable[oldKey];
											newVariable[newKey] = newValue;
											setVariable(newVariable);
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
									<span style={{ display: "flex", alignItems: "center" }}>{String(variable[key])}</span>
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
										const deleteKey = id.replace("variable_", "");
										const newVariable = { ...variable };
										delete newVariable[deleteKey];
										setVariable(newVariable);
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
