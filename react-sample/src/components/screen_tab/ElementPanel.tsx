import React from "react";
import { formElementsTypes, formElementsVariableTypes } from "../../formElementTypes";
import { themeColors } from "../themeColor";
import { variableReplacer } from "../../variableReplacer";
import { propsType } from "../../propsType";

//エレメントパネル
export const ElementPanel: React.FC<{
	props: {
		themeColor: propsType["themeColor"];
		elementPanelHeight: propsType["elementPanelHeight"];
		formElements: propsType["formElements"];
		targetFormElement: propsType["targetFormElement"];
		setTargetFormElement: propsType["setTargetFormElement"];
		targetFormElementIndex: propsType["targetFormElementIndex"];
		setTargetFormElementIndex: propsType["setTargetFormElementIndex"];
		uploadedImages: propsType["uploadedImages"];
		variable: propsType["variable"];
	};
}> = ({ props }) => {
	const row_count = Math.floor((window.innerWidth - 20) / 100);
	function InPanelElement(form_element: formElementsVariableTypes.elementPropertiesTypes.all, index: number) {
		return (
			<div
				style={{
					width: "80px",
					height: "80px",
					margin: "10px",

					display: "flex",
					justifyContent: "flex-start",
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
				<div
					style={{
						pointerEvents: "none",
						userSelect: "none",
						width: "80px",
						height: "80px",
						position: "relative",
						zIndex: 0,
					}}
				>
					{form_element.is_show_image !== "true" ? null : (
						<img
							style={{
								margin: "1px",
								width: "78px",
								height: "78px",
								imageRendering: "pixelated",
							}}
							src={`data:image/png;base64,${getImage(props.uploadedImages, props.variable, form_element.texture)}`}
						/>
					)}
				</div>
				<div
					style={{
						pointerEvents: "none",
						userSelect: "none",
						zIndex: 1,
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						position: "relative",
						width: "100%",
						left: form_element.is_show_image === "true" ? -79 : 0,
					}}
				>
					{form_element.is_show_text !== "true"
						? null
						: form_element.text.split("\\n").map((text, i) => (
								<React.Fragment key={i}>
									<p
										style={{
											whiteSpace: "nowrap",
											margin: 0,
											textAlign: "left",
											lineHeight: `20px`,
											height: `20px`,
											fontSize: "20px",
											overflow: "hidden",
											textOverflow: "ellipsis",
										}}
									>
										{variableReplacer(text, props.variable)}
									</p>
								</React.Fragment>
						  ))}
				</div>
			</div>
		);
	}
	return (
		<div
			id="element_panel"
			style={{
				backgroundColor: themeColors[props.themeColor].element_panel.background,
				width: "100%",
				height: `${props.elementPanelHeight}px`,
				display: "flex",
				flexFlow: "wrap",
				overflowY: "auto",
			}}
		>
			{props.formElements.length === 0 ? null : <span style={{ position: "absolute", fontSize: "8px", marginLeft: "10px" }}>{"layer ----------->"}</span>}
			{props.formElements.map((form_element, index) => (
				<React.Fragment key={index}>{InPanelElement(form_element, index)}</React.Fragment>
			))}
		</div>
	);
};

function getImage(
	uploadedImages: {
		[path: string]: string;
	},
	variable: {
		[key: string]: string | number | boolean;
	},
	texture: string
) {
	const path = variableReplacer(texture, variable);
	const path_png = path + ".png";
	const path_jpg = path + ".jpg";
	const path_jpeg = path + ".jpeg";
	return uploadedImages[path] ?? uploadedImages[path_png] ?? uploadedImages[path_jpg] ?? uploadedImages[path_jpeg] ?? "";
}
