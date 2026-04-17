import React from "react";
import { formElementsVariableTypes } from "../../formElementTypes";
import { variableReplacer } from "../../variableReplacer";
import { useAppContext } from "../../AppContext";

//エレメントジェネレーター
export const ElementsGenerator: React.FC = () => {
	const {
		formElements,
		screenZoomRatio,
		targetFormElementIndex,
		uploadedImages,
		variable,
	} = useAppContext();

	function elementGenerator(formElement: formElementsVariableTypes.elementPropertiesTypes.all, index: number) {
		const replacedFormSizeW = Number(variableReplacer(formElement.w, variable));
		const replacedFormSizeH = Number(variableReplacer(formElement.h, variable));
		const replacedFormSizeX = Number(variableReplacer(formElement.x, variable));
		const replacedFormSizeY = Number(variableReplacer(formElement.y, variable));
		const formSizeW = Number.isNaN(replacedFormSizeW) ? 0 : replacedFormSizeW * screenZoomRatio;
		const formSizeH = Number.isNaN(replacedFormSizeH) ? 0 : replacedFormSizeH * screenZoomRatio;
		const formSizeX = Number.isNaN(replacedFormSizeX) ? 0 : replacedFormSizeX * screenZoomRatio;
		const formSizeY = Number.isNaN(replacedFormSizeY) ? 0 : replacedFormSizeY * screenZoomRatio;
		return (
			<div
				id={`form_element${index}`}
				className={`form_element`}
				style={{
					width: `${formSizeW}px`,
					height: `${formSizeH}px`,
					transform: `translate(${formSizeX}px, ${formSizeY}px)`,
					position: "absolute",
					boxShadow: `${index === targetFormElementIndex ? "0 0 0 2px red inset" : "0 0 0 2px black inset"}`,
					zIndex: `${index === targetFormElementIndex ? 1 : 0}`,

					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexDirection: "column",
				}}
			>
				<div
					style={{
						zIndex: 1,
						height: `${formSizeH}px`,
						position: "absolute",
						display: "flex",
						alignContent: "center",
						justifyContent: "center",
						flexDirection: "column",
					}}
				>
					{formElement.is_show_text !== "true"
						? null
						: formElement.text.split("\\n").map((text, i) => (
								<React.Fragment key={i}>
									<p
										style={{
											fontSize: `${8 * screenZoomRatio}px`,
											whiteSpace: "nowrap",
											pointerEvents: "none",
											userSelect: "none",
											margin: 0,
											marginTop: `${2 * screenZoomRatio}px`,
											textAlign: "left",
											lineHeight: `${10 * screenZoomRatio}px`,
											height: `${8 * screenZoomRatio}px`,
											letterSpacing: "-0.062em",
										}}
									>
										{variableReplacer(text, variable)}
									</p>
								</React.Fragment>
						  ))}
				</div>
				<div
					style={{
						pointerEvents: "none",
						userSelect: "none",
						zIndex: 0,
						width: `${formSizeW - 4}px`,
						height: `${formSizeH - 4}px`,
						position: "absolute",
						display: "flex",
					}}
				>
					{formElement.is_show_image !== "true" ? null : (
						<img
							style={{ imageRendering: "pixelated", width: "100%", height: "100%" }}
							src={`data:image/png;base64,${getImage(uploadedImages, variable, formElement.texture)}`}
						/>
					)}
				</div>
			</div>
		);
	}
	return (
		<div id="form_elements">
			{formElements.map((formElement, index) => (
				<React.Fragment key={index}>{elementGenerator(formElement, index)}</React.Fragment>
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
