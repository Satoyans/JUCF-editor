import { useCallback, useRef, useState } from "react";
import { formElementsTypes } from "../../formElementTypes";
import { propsType } from "../../propsType";
import React from "react";
import { themeColors } from "../themeColor";

function arrayBufferToBase64(buffer: ArrayBuffer) {
	var binary = "";
	var bytes = new Uint8Array(buffer);
	var len = bytes.byteLength;
	for (var i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return window.btoa(binary);
}
export const ImageTab: React.FC<{
	props: propsType;
}> = ({ props }) => {
	return (
		<>
			<div
				style={{
					width: "calc(100% - 14px)",
					height: "50px",
					margin: "5px",
					backgroundColor: themeColors[props.themeColor].dropzone.background,
					border: "solid 2px black",
					display: "flex",
					alignContent: "center",
					justifyContent: "center",
				}}
				onDragOver={(e) => e.preventDefault()}
				onDrop={async (e) => {
					e.preventDefault();
					const items = Array.from(e.dataTransfer.items);

					const base64_images = await Promise.all(
						items.map(
							(item, i) =>
								new Promise<{ base64: string; path: string }[]>(async (resolve) => {
									const entry = item.webkitGetAsEntry();
									if (!entry) return;
									const file_entries = await searchFile(entry);
									const getFile = (file_entry: FileSystemFileEntry) => {
										return new Promise<{ file: File; path: string }>((resolve, reject) => {
											file_entry.file(
												(file) => resolve({ file: file, path: file_entry.fullPath.slice(1) }),
												(e) => reject(e)
											);
										});
									};
									const files = await Promise.all(file_entries.map((f) => getFile(f)));
									const base64_images = await Promise.all(
										files.map(async ({ file, path }) => {
											if (file.type !== "image/png" && file.type !== "image/jpeg") return { path: "", base64: "" };
											return { path, base64: arrayBufferToBase64(await file.arrayBuffer()) };
										})
									);
									resolve(base64_images.filter((v) => v.path !== ""));
								})
						)
					);
					const uploading_images = [...props.uploadingImages, ...base64_images.flat()];

					const result: { [path: string]: string } = {};
					for (let uploading_image of uploading_images) {
						result[uploading_image.path] = uploading_image.base64;
					}
					props.setUploadingImages(
						Object.keys(result).map((v) => {
							return { path: v, base64: result[v] };
						})
					);
				}}
				onClick={(e) => (e.target as HTMLDivElement).querySelector("input")?.click()}
			>
				<input type="file" accept="image/png, image/jpeg" hidden />
				<p style={{ pointerEvents: "none", userSelect: "none" }}>ここにドロップしてファイルまたはフォルダをアップロード</p>
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
				}}
			>
				{props.uploadingImages.map((image, i) => (
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
										src={`data:image/png;base64,${image.base64}`}
									/>
									<a>{image.path}</a>
								</div>
								<div style={{ margin: "10px" }}>
									<button
										id={`uploading_images_${i}`}
										style={{ width: "40px", height: "40px" }}
										onClick={(e) => {
											const target = e.target as HTMLButtonElement;
											const id = target.id;
											console.log(id);
											const index = Number(id.replace("uploading_images_", ""));
											if (Number.isNaN(index)) return;
											const uploading_images = Array.from(props.uploadingImages);
											uploading_images.splice(index, 1);
											props.setUploadingImages(uploading_images);
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

async function searchFile(entry: FileSystemEntry): Promise<FileSystemFileEntry[]> {
	if (entry.isFile) {
		return [entry as FileSystemFileEntry];
	} else if (entry.isDirectory) {
		const dirReader = (entry as FileSystemDirectoryEntry).createReader();
		const getEntries = () =>
			new Promise<FileSystemEntry[]>((resolve) => {
				dirReader.readEntries((entries) => {
					resolve(entries);
				});
			});
		let all_entries: FileSystemEntry[] = [];
		const readAllEntries = async () => {
			const entries = await getEntries();
			if (entries.length > 0) {
				all_entries = [...all_entries, ...entries];
				await readAllEntries();
			}
		};
		await readAllEntries();
		let result_paths: FileSystemFileEntry[] = [];
		for (const entry of all_entries) {
			result_paths.push(...(await searchFile(entry)));
		}
		return result_paths;
	}
	return [];
}
