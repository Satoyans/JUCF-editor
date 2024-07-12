import React from "react";
import { formElementsTypes } from "../../formElementTypes";

//エレメントジェネレーター
export const ElementsGenerator: React.FC<{
	props: {
		formElements: formElementsTypes.elementPropertiesTypes.all[];
		setFormElements: React.Dispatch<React.SetStateAction<formElementsTypes.elementPropertiesTypes.all[]>>;
		screenZoomRatio: number;
		setScreenZoomRatio: React.Dispatch<React.SetStateAction<number>>;
		targetFormElementIndex: number | null;
		setTargetFormElementIndex: React.Dispatch<React.SetStateAction<number | null>>;
		uploadingImages: {
			[path: string]: string;
		};
	};
}> = ({ props }) => {
	function elementGenerator(form_element: formElementsTypes.elementPropertiesTypes.all, index: number) {
		return (
			<div
				id={`form_element${index}`}
				className={`form_element`}
				style={{
					width: `${form_element.w * props.screenZoomRatio}px`,
					height: `${form_element.h * props.screenZoomRatio}px`,
					transform: `translate(${form_element.x * props.screenZoomRatio}px, ${form_element.y * props.screenZoomRatio}px)`,
					position: "absolute",
					// letterSpacing: `${-0.75 * props.screenZoomRatio}px`,
					fontSize: `${10 * props.screenZoomRatio}px`,
					boxShadow: `${index === props.targetFormElementIndex ? "0 0 0 1px red inset" : "0 0 0 1px black inset"}`,
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

						height: `${form_element.h * props.screenZoomRatio}px`,
						position: "absolute",
						display: "flex",
						alignContent: "center",
						justifyContent: "center",
					}}
				>
					{!form_element.is_show_text
						? null
						: form_element.text.split("\\n").map((text, i) => (
								<React.Fragment key={i}>
									<p
										style={{
											whiteSpace: "nowrap",
											margin: 0,
											textAlign: "left",
											pointerEvents: "none",
											userSelect: "none",
											lineHeight: `${10 * props.screenZoomRatio}px`,
											height: `${10 * props.screenZoomRatio}px`,
										}}
									>
										{text}
									</p>
								</React.Fragment>
						  ))}
				</div>
				<div
					style={{
						zIndex: 0,
						width: `${form_element.w * props.screenZoomRatio}px`,
						height: `${form_element.h * props.screenZoomRatio}px`,
						position: "absolute",
					}}
				>
					{!form_element.is_show_image ? null : (
						<img style={{ imageRendering: "pixelated", width: "100%", height: "100%" }} src={`data:image/png;base64,${props.uploadingImages[form_element.texture]}`} />
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
