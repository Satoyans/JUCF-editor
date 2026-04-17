import { useEffect, useRef } from "react";
import { formElementsVariableTypes } from "../../formElementTypes";
import { useAppContext } from "../../AppContext";

export const Output: React.FC = () => {
	const {
		setFormElements,
		formElements,
		formName,
		formSizeVariable,
		isShowFormFrame,
		setTargetFormElementIndex,
		variable,
		setVariable,
		setFormName,
		setFormSizeVariable,
		setIsShowFormFrame,
	} = useAppContext();

	//テキストエリア用のステート
	const textareaFormElements = useRef<HTMLTextAreaElement>(null!);
	useEffect(() => {
		textareaFormElements.current.value = JSON.stringify(
			{
				form_name: formName,
				form_size: formSizeVariable,
				is_show_form_frame: isShowFormFrame,
				variables: variable,
				elements: formElements,
			},
			null,
			2
		);
	}, [formElements, formName, formSizeVariable, isShowFormFrame, variable]);

	const textareaStyle = { fontSize: 12, width: "calc(100% - 10px)" };
	return (
		<div>
			<div>
				<p style={{ margin: 0 }}>追加コマンド(コマンドブロック推奨)</p>
				<div>
					<span>1.</span>
					<textarea
						style={{ width: "calc(100% - 50px)" }}
						value={`/tag @p add "${JSON.stringify({
							form_name: formName,
							form_size: formSizeVariable,
							is_show_form_frame: isShowFormFrame,
							variables: variable,
							elements: formElements,
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
			<div>
				<span>復元コード(このサイト用)</span>
				<button
					onClick={() => {
						try {
							const inputValueSample = {
								form_name: "",
								form_size: { x: "", y: "" },
								is_show_form_frame: "",
								variables: {},
								elements: [],
							};
							const inputValue = JSON.parse(textareaFormElements.current.value);

							//キーがすべてあるかチェック
							if (Object.keys(inputValue).length !== Object.keys(inputValueSample).length) throw new Error("キーの数が異常です");
							for (let key of Object.keys(inputValueSample)) {
								const value = inputValue[key as keyof typeof inputValueSample];
								if (value === undefined) throw new Error(`キー"${key}"が不足しています。`);
							}
							//展開
							const { elements, form_name, form_size, is_show_form_frame, variables } = inputValue as typeof inputValueSample;
							
							//チェックが必要
							let indexCount = 0;
							for (let element of elements) {
								const elementType: formElementsVariableTypes.elementPropertiesTypes.all = {
									h: "0",
									w: "0",
									x: "0",
									y: "0",
									hover_text: "",
									texture: "",
									command: "",
									text: "",
									aux: "",
									is_show_button: "true",
									is_show_close: "true",
									is_show_image: "true",
									is_show_text: "true",
									is_show_item: "true",
								};
								if (Object.keys(element).length !== Object.keys(elementType).length && Object.keys(element).length - 1 !== Object.keys(elementType).length)
									throw new Error(`elements index:${indexCount}\nキーの数が異常です。`);
								for (let key of Object.keys(element)) {
									if (Object.keys(element).length - 1 === Object.keys(elementType).length && key === "label") continue;
									if (!Object.keys(elementType).includes(key)) throw new Error(`elements index:${indexCount}\nキーが異常です。,key:${key}`);
									const typedKey = key as
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
									if (typeof element[key] !== typeof elementType[typedKey]) throw new Error(`値の型が異常です。index:${indexCount},key:${key}`);
								}
								indexCount += 1;
							}
							//elements
							setFormElements(elements);
							setTargetFormElementIndex(null);
							//variables
							setVariable(variables);
							//form_name
							setFormName(form_name);
							//form_size
							setFormSizeVariable(form_size);
							//is_show_form_size
							setIsShowFormFrame(is_show_form_frame);
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
						...textareaStyle,
						height: `${
							((JSON.stringify(
								{
									form_name: formName,
									form_size: formSizeVariable,
									is_show_form_frame: isShowFormFrame,
									variables: variable,
									elements: formElements,
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
		</div>
	);
};
