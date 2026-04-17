import React, { useEffect, useRef, useState } from "react";
import { themeColors } from "../themeColor";
import { useAppContext } from "../../AppContext";

export const ImageList: React.FC = () => {
	const { uploadedImages, setUploadedImages, themeColor } = useAppContext();
	const [editNameImage, setEditNameImage] = useState<string | null>(null);
	const ref = useRef<HTMLInputElement>(null!);
	useEffect(() => {
		if (!editNameImage) return;
		ref.current.value = editNameImage.replace("uploaded_images_", "");
	}, [editNameImage]);
	useEffect(() => {
		setEditNameImage(null);
	}, [Object.keys(uploadedImages).length]);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
			}}
		>
			{Object.keys(uploadedImages)
				.sort((a, b) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1))
				.map((path, i) => (
					<React.Fragment key={i}>
						{
							<div
								id={`uploaded_images_${path}`}
								style={{
									margin: "5px",
									marginBottom: 0,
									height: "60px",
									border: "solid 1px black",
									backgroundColor: themeColors[themeColor].image_panel.background,
									display: "flex",
									justifyContent: "space-between",
								}}
							>
								<div
									style={{
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
										width: "80%",
									}}
								>
									<img
										style={{ width: "50px", height: "50px", margin: "5px", imageRendering: "pixelated", border: "solid 1px" }}
										src={`data:image/png;base64,${uploadedImages[path]}`}
									/>
									{(() => {
										if (editNameImage !== `uploaded_images_${path}`) return <p>{path}</p>;
										return (
											<div style={{ height: "25px", width: "80%", display: "flex", justifyContent: "space-between" }}>
												<input style={{ height: "calc(100% - 6px)", fontSize: "16px", width: "100%" }} type="text" ref={ref} />
												<button
													style={{ height: "100%", width: "60px" }}
													onClick={(e) => {
														const newKey = ref.current.value;
														if (newKey === "") return;
														const target = e.target as HTMLButtonElement;
														const id = target.parentElement!.parentElement!.parentElement!.id;
														const key = id.replace("uploaded_images_", "");
														if (newKey.split(".")[newKey.split(".").length - 1] !== key.split(".")[key.split(".").length - 1])
															return window.alert("拡張子が一致しません");
														if (newKey === key) return;
														const uploadedImagesCopy = { ...uploadedImages };
														uploadedImagesCopy[newKey] = uploadedImagesCopy[key];
														delete uploadedImagesCopy[key];
														setUploadedImages(uploadedImagesCopy);
													}}
												>
													更新
												</button>
											</div>
										);
									})()}
								</div>
								<div style={{ display: "flex", flexDirection: "row" }}>
									<div className="edit_button" style={{ margin: "10px 5px" }}>
										<button
											id={`uploaded_images_${path}`}
											style={{ width: "40px", height: "40px" }}
											onClick={(e) => {
												const target = e.target as HTMLButtonElement;
												const id = target.parentElement!.parentElement!.parentElement!.id;
												if (editNameImage === id) return setEditNameImage(null);
												setEditNameImage(id);
											}}
										>
											<a style={{ fontSize: "24px", userSelect: "none", pointerEvents: "none" }}>🖋</a>
										</button>
									</div>
									<div className="remove_button" style={{ margin: "10px 5px" }}>
										<button
											style={{ width: "40px", height: "40px" }}
											onClick={(e) => {
												const target = e.target as HTMLButtonElement;
												const id = target.parentElement!.parentElement!.parentElement!.id;
												const removeImagePath = id.replace("uploaded_images_", "");
												const uploadedImagesCopy = { ...uploadedImages };
												delete uploadedImagesCopy[removeImagePath];
												setUploadedImages(uploadedImagesCopy);
											}}
										>
											<a style={{ fontSize: "24px", userSelect: "none", pointerEvents: "none" }}>🗑</a>
										</button>
									</div>
								</div>
							</div>
						}
					</React.Fragment>
				))}
		</div>
	);
};
