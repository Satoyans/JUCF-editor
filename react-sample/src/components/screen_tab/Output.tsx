import { useEffect, useRef, useState } from "react";
import { formElementsTypes, formElementsVariableTypes } from "../../formElementTypes";

export const Output: React.FC<{
	props: {
		setFormElements: React.Dispatch<React.SetStateAction<formElementsVariableTypes.elementPropertiesTypes.all[]>>;
		formElements: formElementsVariableTypes.elementPropertiesTypes.all[];
		formName: string;
		formSize: {
			x: number;
			y: number;
		};
		isShowFormFrame: string;
		setTargetFormElementIndex: React.Dispatch<React.SetStateAction<number | null>>;
		variable: {
			[key: string]: string | number | boolean;
		};
		formSizeVariable: {
			x: string;
			y: string;
		};
		setVariable: React.Dispatch<
			React.SetStateAction<{
				[key: string]: string | number | boolean;
			}>
		>;
		setFormName: React.Dispatch<React.SetStateAction<string>>;
		setFormSizeVariable: React.Dispatch<
			React.SetStateAction<{
				x: string;
				y: string;
			}>
		>;
		setIsShowFormFrame: React.Dispatch<React.SetStateAction<string>>;
	};
}> = ({ props }) => {
	//テキストエリア用のステート
	const textareaFormElements = useRef<HTMLTextAreaElement>(null!);
	useEffect(() => {
		textareaFormElements.current.value = JSON.stringify(
			{
				form_name: props.formName,
				form_size: props.formSizeVariable,
				is_show_form_frame: props.isShowFormFrame,
				variables: props.variable,
				elements: props.formElements,
			},
			null,
			2
		);
	}, [props.formElements]);

	const textarea_style = { fontSize: 12, width: "calc(100% - 10px)" };
	return (
		<div>
			<div>
				<span>復元コード(このサイト用)</span>
				<button
					onClick={(e) => {
						try {
							const input_value_sample = {
								form_name: "",
								form_size: { x: "", y: "" },
								is_show_form_frame: "",
								variables: {},
								elements: [],
							};
							// const form_elements = JSON.parse(((e.target as HTMLButtonElement).parentElement?.querySelector("textarea") as HTMLTextAreaElement).value);
							const input_value = JSON.parse(textareaFormElements.current.value);

							//キーがすべてあるかチェック
							if (Object.keys(input_value).length !== Object.keys(input_value_sample).length) throw new Error("キーの数が異常です");
							for (let key of Object.keys(input_value_sample)) {
								const value = input_value[key as keyof typeof input_value_sample];
								if (value === undefined) throw new Error(`キー"${key}"が不足しています。`);
							}
							//展開
							const { elements, form_name, form_size, is_show_form_frame, variables } = input_value as typeof input_value_sample;
							//そのままでOK
							//form_name
							//form_size
							//is_show_form_frame
							//variables

							//チェックが必要
							//elements
							let index_count = 0;
							for (let element of elements) {
								const element_type: formElementsVariableTypes.elementPropertiesTypes.all = {
									h: "0",
									w: "0",
									x: "0",
									y: "0",
									hover_text: "",
									texture: "",
									text: "",
									is_show_button: "true",
									is_show_close: "true",
									is_show_image: "true",
									is_show_text: "true",
								};
								if (Object.keys(element).length !== Object.keys(element_type).length && Object.keys(element).length - 1 !== Object.keys(element_type).length)
									throw new Error(`elements index:${index_count}\nキーの数が異常です。`);
								for (let key of Object.keys(element)) {
									if (Object.keys(element).length - 1 === Object.keys(element_type).length && key === "label") continue;
									if (!Object.keys(element_type).includes(key)) throw new Error(`elements index:${index_count}\nキーが異常です。,key:${key}`);
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
									if (typeof element[key] !== typeof element_type[typed_key]) throw new Error(`値の型が異常です。index:${index_count},key:${key}`);
								}
								index_count += 1;
							}
							//elements
							props.setFormElements(elements);
							props.setTargetFormElementIndex(null);
							//variables
							props.setVariable(variables);
							//form_name
							props.setFormName(form_name);
							//form_size
							props.setFormSizeVariable(form_size);
							//is_show_form_size
							props.setIsShowFormFrame(is_show_form_frame);
						} catch (e) {
							window.alert(`テキストエリアからの読み込み中にエラー:\n${e}`);
						}
					}}
				>
					ロード
				</button>
				<textarea
					ref={textareaFormElements}
					style={{
						...textarea_style,
						height: `${
							((JSON.stringify(
								{
									form_name: props.formName,
									form_size: props.formSizeVariable,
									is_show_form_frame: props.isShowFormFrame,
									variables: props.variable,
									elements: props.formElements,
								},
								null,
								2
							).match(/\n/g)?.length ?? 0) +
								1) *
							12
						}px`,
					}}
				></textarea>
			</div>
			<div>
				<p style={{ margin: 0 }}>追加コマンド(コマンドブロック推奨)</p>
				<div>
					<span>1.</span>
					<textarea
						style={{ width: "calc(100% - 50px)" }}
						//value={`/tag @p add {"form_name":${props.formName},"form_size":{"x":${props.formSize.x},"y":${props.formSize.y}},"isShowFormFrame":${
						//	props.isShowFormFrame
						//},"elements":${JSON.stringify(props.formElements)}}`.replaceAll('"', "'")}
						value={`/tag @p add "${JSON.stringify({
							form_name: props.formName,
							form_size: props.formSizeVariable,
							is_show_form_frame: props.isShowFormFrame,
							variables: props.variable,
							elements: props.formElements,
						})
							.replace(/\\/g, "\\\\")
							.replace(/"/g, '\\"')}"`}
						readOnly={true}
					/>
				</div>
				<div>
					<span>2.</span>
					<textarea style={{ width: "calc(100% - 50px)" }} value={"/scriptevent cf:tag"} onChange={(e) => e.preventDefault()} readOnly={true} />
				</div>
			</div>
		</div>
	);
};
