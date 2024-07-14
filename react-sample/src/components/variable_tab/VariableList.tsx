import React from "react";

export const VariableList: React.FC<{
	props: {
		variable: {
			[key: string]: string | number | boolean;
		};
		setVariable: React.Dispatch<
			React.SetStateAction<{
				[key: string]: string | number | boolean;
			}>
		>;
	};
}> = ({ props }) => {
	return (
		<>
			{Object.keys(props.variable)
				.sort((a, b) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1))
				.map((key, i) => (
					<React.Fragment key={i}>
						<div>
							<span>{key}</span>
							<span>:</span>
							<span>{props.variable[key]}</span>
						</div>
					</React.Fragment>
				))}
		</>
	);
};
