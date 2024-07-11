import { useEffect, useRef, useState } from "react";
import { formElementsTypes } from "../../formElementTypes";

export const Output: React.FC<{
	props: {
		setFormElements: React.Dispatch<React.SetStateAction<formElementsTypes.elementPropertiesTypes.all[]>>;
		formElements: formElementsTypes.elementPropertiesTypes.all[];
		formName: string;
		formSize: {
			x: number;
			y: number;
		};
		showFormFrame: boolean;
		setTargetFormElementIndex: React.Dispatch<React.SetStateAction<number | null>>;
	};
}> = ({ props }) => {
	//テキストエリア用のステート
	console.log("レンダリング");
	const textareaFormElements = useRef<HTMLTextAreaElement>(null!);
	useEffect(() => {
		textareaFormElements.current.value = JSON.stringify(props.formElements, null, 2);
	}, [props.formElements]);

	const textarea_style = { fontSize: 12, width: "calc(100% - 10px)" };
	return (
		<div>
			<div>
				<a>復元コード(このサイト用)</a>
				<button
					onClick={(e) => {
						try {
							// const form_elements = JSON.parse(((e.target as HTMLButtonElement).parentElement?.querySelector("textarea") as HTMLTextAreaElement).value);
							const form_elements = JSON.parse(textareaFormElements.current.value);
							let index_count = 0;
							for (let form_element of form_elements) {
								const element_type: formElementsTypes.elementPropertiesTypes.all = {
									h: 0,
									w: 0,
									x: 0,
									y: 0,
									hover_text: "",
									texture: "",
									text: "",
									is_show_button: true,
									is_show_close: true,
									is_show_image: true,
									is_show_text: true,
								};
								if (Object.keys(form_element).length !== Object.keys(element_type).length) throw new Error(`キーの数が異常です。index:${index_count}`);
								for (let key of Object.keys(form_element)) {
									if (!Object.keys(element_type).includes(key)) throw new Error(`キーが異常です。index:${index_count},key:${key}`);
									const typed_key = key as
										| "h"
										| "w"
										| "x"
										| "y"
										| "hover_text"
										| "texture"
										| "text"
										| "is_show_button"
										| "is_show_close"
										| "is_show_image"
										| "is_show_text";
									if (typeof form_element[key] !== typeof element_type[typed_key]) throw new Error(`値の型が異常です。index:${index_count},key:${key}`);
								}
								console.log(Object.keys(form_element));
								index_count += 1;
							}
							props.setFormElements(form_elements);
							props.setTargetFormElementIndex(null);
						} catch (e) {
							window.alert(`テキストエリアからの読み込み中にエラー:\n${e}`);
						}
					}}
				>
					ロード
				</button>
				<textarea
					defaultValue={JSON.stringify(props.formElements, null, 2)}
					ref={textareaFormElements}
					style={{ ...textarea_style, height: `${((JSON.stringify(props.formElements, null, 2).match(/\n/g)?.length ?? 0) + 1) * 12}px` }}
				></textarea>
			</div>
			<div>
				<p style={{ margin: 0 }}>追加コマンド(コマンドブロック推奨)</p>
				<div>
					<a>1.</a>
					<textarea
						style={{ width: "calc(100% - 50px)" }}
						value={`/tag @p add {"form_name":${props.formName},"form_size":{"x":${props.formSize.x},"y":${props.formSize.y}},"showFormFrame":${
							props.showFormFrame
						},"elements":${JSON.stringify(props.formElements)}}`.replaceAll('"', "'")}
					/>
				</div>
				<div>
					<a>2.</a>
					<textarea style={{ width: "calc(100% - 50px)" }} value={"/scriptevent cf:tag"} onChange={(e) => e.preventDefault()} />
				</div>
			</div>
		</div>
	);
};
