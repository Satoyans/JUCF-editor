import { useEffect, useState } from "react";
import { propsType } from "../../propsType";
import { themeColors } from "../themeColor";

export const Dropzone: React.FC<{
	props: {
		uploadedImages: propsType["uploadedImages"];
		setUploadedImages: propsType["setUploadedImages"];
		themeColor: propsType["themeColor"];
	};
}> = ({ props }) => {
	return (
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
					items.map(async (item, i) => {
						return new Promise<{ base64: string; path: string }[]>(async (resolve) => {
							//エントリーを取得
							const entry = item.webkitGetAsEntry();
							if (!entry) return;
							//再帰的に調べてファイルの一覧を返す
							const file_entries = await searchFile(entry);
							//ファイルエントリーからファイルとフルパスを取得
							const files = await Promise.all(
								file_entries.map(
									(file_entry) =>
										new Promise<{ file: File; path: string }>((resolve, reject) => {
											file_entry.file(
												(file) => resolve({ file: file, path: file_entry.fullPath.slice(1) }),
												(e) => reject(e)
											);
										})
								)
							);
							//ファイルからbase64の画像とフルパスのオブジェクトに変換
							const base64_images = (
								await Promise.all(
									files.map(async ({ file, path }) => {
										if (file.type !== "image/png" && file.type !== "image/jpeg") return { path: "", base64: "" };
										if (!file.name.endsWith(".png") && !file.type.endsWith(".jpeg") && !file.type.endsWith(".jpg")) return { path: "", base64: "" };
										return { path, base64: arrayBufferToBase64(await file.arrayBuffer()) };
									})
								)
							).filter((v) => v.path !== "");
							resolve(base64_images);
						});
					})
				);
				//前のステートの値を別オブジェクトとして生成
				const result: { [path: string]: string } = { ...props.uploadedImages };
				//前のステートに追加
				for (let uploaded_image of base64_images.flat()) {
					result[uploaded_image.path] = uploaded_image.base64;
				}
				//セット
				props.setUploadedImages(result);
			}}
		>
			<p style={{ pointerEvents: "none", userSelect: "none" }}>ここにドロップしてファイルまたはフォルダをアップロード</p>
		</div>
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

function arrayBufferToBase64(buffer: ArrayBuffer) {
	var binary = "";
	var bytes = new Uint8Array(buffer);
	var len = bytes.byteLength;
	for (var i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return window.btoa(binary);
}
