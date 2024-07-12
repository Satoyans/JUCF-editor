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
			<ImageList props={{ ...props }} />
		</>
	);
};
