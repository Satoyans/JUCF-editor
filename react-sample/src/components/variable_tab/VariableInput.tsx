export const VariableInput: React.FC<{ props: {} }> = ({ props }) => {
	return (
		<div style={{ margin: "5px", backgroundColor: "#eeeeee", height: "100px", border: "solid 1px black" }}>
			<input style={{ width: "calc(100% - 20px)" }} type="text" />
		</div>
	);
};
