import { useAppContext } from "../../AppContext";
import React from "react";
import { Dropzone } from "./Dropzone";
import { ImageList } from "./ImageList";

export const ImageTab: React.FC = () => {
	const { uploadedImages, setUploadedImages } = useAppContext();
	return (
		<>
			<Dropzone />
			{Object.keys(uploadedImages).length !== 0 ? (
				<div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
					<button
						style={{ width: "calc(100% - 10px)" }}
						onClick={(e) => {
							setUploadedImages({});
						}}
					>
						全て削除
					</button>
				</div>
			) : (
				<></>
			)}
			<ImageList />
		</>
	);
};
