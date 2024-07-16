import React from "react";
import { formElementsTypes, formElementsVariableTypes } from "../../formElementTypes";
import { variableReplacer } from "../../variableReplacer";

//エレメントジェネレーター
export const ElementsGenerator: React.FC<{
	props: {
		formElements: formElementsVariableTypes.elementPropertiesTypes.all[];
		setFormElements: React.Dispatch<React.SetStateAction<formElementsVariableTypes.elementPropertiesTypes.all[]>>;
		screenZoomRatio: number;
		setScreenZoomRatio: React.Dispatch<React.SetStateAction<number>>;
		targetFormElementIndex: number | null;
		setTargetFormElementIndex: React.Dispatch<React.SetStateAction<number | null>>;
		uploadedImages: {
			[path: string]: string;
		};
		variable: {
			[key: string]: string | number | boolean;
		};
	};
}> = ({ props }) => {
	function elementGenerator(form_element: formElementsVariableTypes.elementPropertiesTypes.all, index: number) {
		const replaced_form_size_w = Number(variableReplacer(form_element.w, props.variable));
		const replaced_form_size_h = Number(variableReplacer(form_element.h, props.variable));
		const replaced_form_size_x = Number(variableReplacer(form_element.x, props.variable));
		const replaced_form_size_y = Number(variableReplacer(form_element.y, props.variable));
		const form_size_w = Number.isNaN(replaced_form_size_w) ? 0 : replaced_form_size_w * props.screenZoomRatio;
		const form_size_h = Number.isNaN(replaced_form_size_h) ? 0 : replaced_form_size_h * props.screenZoomRatio;
		const form_size_x = Number.isNaN(replaced_form_size_x) ? 0 : replaced_form_size_x * props.screenZoomRatio;
		const form_size_y = Number.isNaN(replaced_form_size_y) ? 0 : replaced_form_size_y * props.screenZoomRatio;
		return (
			<div
				id={`form_element${index}`}
				className={`form_element`}
				style={{
					width: `${form_size_w}px`,
					height: `${form_size_h}px`,
					transform: `translate(${form_size_x}px, ${form_size_y}px)`,
					position: "absolute",
					// letterSpacing: `${-0.75 * props.screenZoomRatio}px`,
					fontSize: `${10 * props.screenZoomRatio}px`,
					boxShadow: `${index === props.targetFormElementIndex ? "0 0 0 2px red inset" : "0 0 0 2px black inset"}`,
					zIndex: `${index === props.targetFormElementIndex ? 1 : 0}`,

					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexDirection: "column",
				}}
			>
				<div
					style={{
						zIndex: 1,
						// width: `${form_element.w * props.screenZoomRatio}px`,

						height: `${form_size_h}px`,
						position: "absolute",
						display: "flex",
						alignContent: "center",
						justifyContent: "center",
						flexDirection: "column",
					}}
				>
					{form_element.is_show_text !== "true"
						? null
						: form_element.text.split("\\n").map((text, i) => (
								<React.Fragment key={i}>
									<p
										style={{
											whiteSpace: "nowrap",
											pointerEvents: "none",
											userSelect: "none",
											margin: 0,
											textAlign: "left",
											lineHeight: `${10 * props.screenZoomRatio}px`,
											height: `${10 * props.screenZoomRatio}px`,
										}}
									>
										{variableReplacer(text, props.variable)}
									</p>
								</React.Fragment>
						  ))}
				</div>
				<div
					style={{
						pointerEvents: "none",
						userSelect: "none",
						zIndex: 0,
						width: `${form_size_w - 4}px`,
						height: `${form_size_h - 4}px`,
						position: "absolute",
						display: "flex",
					}}
				>
					{form_element.is_show_image !== "true" ? null : (
						<img
							style={{ imageRendering: "pixelated", width: "100%", height: "100%" }}
							src={`data:image/png;base64,${getImage(props.uploadedImages, props.variable, form_element.texture)}`}
						/>
					)}
				</div>
			</div>
		);
	}
	return (
		<div id="form_elements">
			{props.formElements.map((form_element, index) => (
				<React.Fragment key={index}>{elementGenerator(form_element, index)}</React.Fragment>
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
