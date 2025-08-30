import { useCallback, useRef, useState } from "react";
import { formElementsTypes } from "../../formElementTypes";
import { propsType } from "../../propsType";
import React from "react";
import { themeColors } from "../themeColor";
import { Dropzone } from "./Dropzone";
import { ImageList } from "./ImageList";

export const ImageTab: React.FC<{
	props: propsType;
}> = ({ props }) => {
	return (
		<>
			<Dropzone props={{ ...props }} />
			{Object.keys(props.uploadedImages).length !== 0 ? (
				<div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
					<button
						style={{ width: "calc(100% - 10px)" }}
						onClick={(e) => {
							props.setUploadedImages({});
						}}
					>
						全て削除
					</button>
				</div>
			) : (
				<></>
			)}
			<ImageList props={{ ...props }} />
		</>
	);
};
