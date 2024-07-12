import { propsType } from "../../propsType";
import { themeColors } from "../themeColor";

export const Dropzone: React.FC<{
	props: {
		uploadingImages: { [path: string]: string };
		setUploadingImages: React.Dispatch<
			React.SetStateAction<{
				[path: string]: string;
			}>
		>;
		themeColor: "Light" | "Dark";
	};
}> = ({ props }) => (
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
			const result: { [path: string]: string } = props.uploadingImages;
			for (let uploading_image of base64_images.flat()) {
				result[uploading_image.path] = uploading_image.base64;
			}
			props.setUploadingImages(result);
		}}
	>
		<p style={{ pointerEvents: "none", userSelect: "none" }}>ここにドロップしてファイルまたはフォルダをアップロード</p>
	</div>
);

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
