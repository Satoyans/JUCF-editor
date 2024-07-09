import React from "react";
import { formElementsTypes } from "../formElementTypes";
import { theme_color_dict } from "./themeColor";

//エレメントパネル
export const ElementPanel: React.FC<{
	props: {
		themeColor: "Light" | "Dark";
		elementPanelHeight: number;
		formElements: formElementsTypes.elementPropertiesTypes.all[];
		targetFormElement: null | HTMLElement;
		setTargetFormElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
		targetFormElementIndex: number | null;
		setTargetFormElementIndex: React.Dispatch<React.SetStateAction<number | null>>;
	};
}> = ({ props }) => {
	const row_count = Math.floor((window.innerWidth - 20) / 100);
	function InPanelElement(form_element: formElementsTypes.elementPropertiesTypes.all, index: number) {
		return (
			<div
				style={{
					width: "80px",
					height: "80px",
					margin: "10px",

					display: "flex",
					justifyContent: " center",
					alignItems: "center",
					boxShadow: `${index === props.targetFormElementIndex ? "0 0 0 1px red inset" : "0 0 0 1px black inset"}`,
				}}
				id={`in_panel_element${index}`}
				onClick={(e) => {
					const form_element_index = Number((e.target as HTMLDivElement).id.replace("in_panel_element", ""));
					if (Number.isNaN(form_element_index)) throw new Error("element_panel_index is not a number!");
					props.setTargetFormElementIndex(form_element_index);
				}}
			>
				<p
					style={{
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
						margin: 0,
						pointerEvents: "none",
						userSelect: "none",
					}}
				>
					{form_element.text}
				</p>
				<img></img>
			</div>
		);
	}
	return (
		<div
			id="element_panel"
			style={{
				backgroundColor: theme_color_dict[props.themeColor].element_panel.background,
				width: "100%",
				height: `${props.elementPanelHeight}px`,
				display: "flex",
				flexFlow: "wrap",
				overflowY: "auto",
			}}
		>
			{props.formElements.map((form_element, index) => (
				<React.Fragment key={index}>{InPanelElement(form_element, index)}</React.Fragment>
			))}
		</div>
	);
};
