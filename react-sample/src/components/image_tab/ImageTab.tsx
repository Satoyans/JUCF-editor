import { useCallback, useRef, useState } from "react";
import { formElementsTypes } from "../../formElementTypes";
import { propsType } from "../../propsType";
import React from "react";
import { themeColors } from "../themeColor";
import { Dropzone } from "./Dropzone";

export const ImageTab: React.FC<{
	props: propsType;
}> = ({ props }) => {
	return (
		<>
			<Dropzone props={props} />
			<div
				style={{
					display: "flex",
					flexDirection: "column",
				}}
			>
				{Object.keys(props.uploadedImages).map((path, i) => (
					<React.Fragment key={i}>
						{
							<div
								style={{
									margin: "5px",
									height: "60px",
									border: "solid 1px black",
									backgroundColor: themeColors[props.themeColor].image_panel.background,
									display: "flex",
									justifyContent: "space-between",
								}}
							>
								<div
									style={{
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
									}}
								>
									<img
										style={{ width: "50px", height: "50px", margin: "5px", imageRendering: "pixelated", border: "solid 1px" }}
										src={`data:image/png;base64,${props.uploadedImages[path]}`}
									/>
									<a>{path}</a>
								</div>
								<div style={{ margin: "10px" }}>
									<button
										id={`uploaded_images_${path}`}
										style={{ width: "40px", height: "40px" }}
										onClick={(e) => {
											const target = e.target as HTMLButtonElement;
											const id = target.id;
											console.log(id);
											const remove_image_path = id.replace("uploaded_images_", "");
											const uploaded_images = JSON.parse(JSON.stringify(props.uploadedImages));
											delete uploaded_images[remove_image_path];
											props.setUploadedImages(uploaded_images);
										}}
									>
										<a style={{ fontSize: "24px", userSelect: "none", pointerEvents: "none" }}>🗑</a>
									</button>
								</div>
							</div>
						}
					</React.Fragment>
				))}
			</div>
		</>
	);
};
