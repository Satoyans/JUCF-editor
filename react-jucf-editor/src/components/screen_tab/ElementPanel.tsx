import React from "react";
import { formElementsVariableTypes } from "../../formElementTypes";
import { themeColors } from "../themeColor";
import { variableReplacer } from "../../variableReplacer";
import { useAppContext } from "../../AppContext";

//エレメントパネル
export const ElementPanel: React.FC = () => {
	const {
		themeColor,
		elementPanelHeight,
		formElements,
		targetFormElementIndex,
		setTargetFormElementIndex,
		uploadedImages,
		variable,
	} = useAppContext();

	// const rowCount = Math.floor((window.innerWidth - 20) / 100);
	function InPanelElement(formElement: formElementsVariableTypes.elementPropertiesTypes.all, index: number) {
		return (
			<div
				style={{
					width: "80px",
					height: "80px",
					margin: "10px",

					display: "flex",
					justifyContent: "flex-start",
					alignItems: "center",
					boxShadow: `${index === targetFormElementIndex ? "0 0 0 1px red inset" : "0 0 0 1px black inset"}`,
				}}
				id={`in_panel_element${index}`}
				onClick={(e) => {
					const formElementIndex = Number((e.currentTarget as HTMLDivElement).id.replace("in_panel_element", ""));
					if (Number.isNaN(formElementIndex)) throw new Error("element_panel_index is not a number!");
					setTargetFormElementIndex(formElementIndex);
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
					{formElement.is_show_image !== "true" ? null : (
						<img
							style={{
								margin: "1px",
								width: "78px",
								height: "78px",
								imageRendering: "pixelated",
							}}
							src={`data:image/png;base64,${getImage(uploadedImages, variable, formElement.texture)}`}
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
						left: formElement.is_show_image === "true" ? -79 : 0,
					}}
				>
					{formElement.is_show_text !== "true"
						? null
						: formElement.text.split("\\n").map((text, i) => (
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
										{variableReplacer(text, variable)}
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
				backgroundColor: themeColors[themeColor].element_panel.background,
				width: "100%",
				height: `${elementPanelHeight}px`,
				display: "flex",
				flexFlow: "wrap",
				overflowY: "auto",
			}}
		>
			{formElements.length === 0 ? null : <span style={{ position: "absolute", fontSize: "8px", marginLeft: "10px" }}>{"layer ----------->"}</span>}
			{formElements.map((formElement, index) => (
				<React.Fragment key={index}>{InPanelElement(formElement, index)}</React.Fragment>
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
	const pathPng = path + ".png";
	const pathJpg = path + ".jpg";
	const pathJpeg = path + ".jpeg";
	return uploadedImages[path] ?? uploadedImages[pathPng] ?? uploadedImages[pathJpg] ?? uploadedImages[pathJpeg] ?? "";
}
