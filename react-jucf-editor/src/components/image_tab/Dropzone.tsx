import { themeColors } from "../themeColor";
import { useAppContext } from "../../AppContext";

export const Dropzone: React.FC = () => {
	const { uploadedImages, setUploadedImages, themeColor } = useAppContext();
	return (
		<div
			style={{
				width: "calc(100% - 14px)",
				height: "50px",
				margin: "5px",
				backgroundColor: themeColors[themeColor].dropzone.background,
				border: "solid 2px black",
				display: "flex",
				alignContent: "center",
				justifyContent: "center",
			}}
			onDragOver={(e) => e.preventDefault()}
			onDrop={async (e) => {
				e.preventDefault();
				const items = Array.from(e.dataTransfer.items);
				const base64Images = await Promise.all(
					items.map(async (item, i) => {
						return new Promise<{ base64: string; path: string }[]>(async (resolve) => {
							//エントリーを取得
							const entry = item.webkitGetAsEntry();
							if (!entry) return;
							//再帰的に調べてファイルの一覧を返す
							const fileEntries = await searchFile(entry);
							//ファイルエントリーからファイルとフルパスを取得
							const files = await Promise.all(
								fileEntries.map(
									(fileEntry) =>
										new Promise<{ file: File; path: string }>((resolve, reject) => {
											fileEntry.file(
												(file) => resolve({ file: file, path: fileEntry.fullPath.slice(1) }),
												(e) => reject(e)
											);
										})
								)
							);
							//ファイルからbase64の画像とフルパスのオブジェクトに変換
							const base64ImagesResolved = (
								await Promise.all(
									files.map(async ({ file, path }) => {
										if (file.type !== "image/png" && file.type !== "image/jpeg") return { path: "", base64: "" };
										if (!file.name.endsWith(".png") && !file.name.endsWith(".jpeg") && !file.name.endsWith(".jpg")) return { path: "", base64: "" };
										return { path, base64: arrayBufferToBase64(await file.arrayBuffer()) };
									})
								)
							).filter((v) => v.path !== "");
							resolve(base64ImagesResolved);
						});
					})
				);
				//前のステートの値を別オブジェクトとして生成
				const result: { [path: string]: string } = { ...uploadedImages };
				//前のステートに追加
				for (let uploadedImage of base64Images.flat()) {
					result[uploadedImage.path] = uploadedImage.base64;
				}
				//セット
				setUploadedImages(result);
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
		let allEntries: FileSystemEntry[] = [];
		const readAllEntries = async () => {
			const entries = await getEntries();
			if (entries.length > 0) {
				allEntries = [...allEntries, ...entries];
				await readAllEntries();
			}
		};
		await readAllEntries();
		let resultPaths: FileSystemFileEntry[] = [];
		for (const entry2 of allEntries) {
			resultPaths.push(...(await searchFile(entry2)));
		}
		return resultPaths;
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
