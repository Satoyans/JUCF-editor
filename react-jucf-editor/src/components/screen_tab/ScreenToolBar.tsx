import { useAppContext } from "../../AppContext";
import { formElementsVariableTypes } from "../../formElementTypes";

function createFormElement(): formElementsVariableTypes.elementPropertiesTypes.all {
	return {
		h: "30",
		w: "30",
		x: "0",
		y: "0",
		text: "text",
		texture: "",
		command: "",
		hover_text: "",
		aux: "0",
		is_show_button: "false",
		is_show_close: "false",
		is_show_image: "false",
		is_show_item: "false",
		is_show_text: "true",
	};
}

export const ScreenToolBar: React.FC = () => {
    const {
        formElements,
        setFormElements,
        targetFormElementIndex,
        setTargetFormElementIndex,
        setIsDontRecode,
        statePastRecoder,
        setStatePastRecoder,
        stateFutureRecoder,
        setStateFutureRecoder,
        editMode,
        setEditMode
    } = useAppContext();

    const btnStyle = { width: "calc(100% - 14px)", margin: "4px 7px" };
    const SectionHeader: React.FC<{title: string}> = ({title}) => (
        <div style={{ textAlign: "center", fontSize: "11px", fontWeight: "bold", borderBottom: "1px solid #e5e7eb", margin: "10px 10px 5px", paddingBottom: "2px", color: "#6b7280" }}>{title}</div>
    );

    return (
        <div style={{ width: "90px", minHeight: "100%", borderRight: "1px solid #e5e7eb", backgroundColor: "#ffffff", display: "flex", flexDirection: "column" }}>
            
            <SectionHeader title="要素を操作" />
            <button
                style={btnStyle}
                onClick={() => {
                    const formElementsCopy = JSON.parse(JSON.stringify(formElements));
                    formElementsCopy.push(createFormElement());
                    setFormElements(formElementsCopy);
                    setTargetFormElementIndex(formElementsCopy.length - 1);
                }}
            >
                追加
            </button>
            <button
                style={btnStyle}
                disabled={targetFormElementIndex === null}
                onClick={() => {
                    const index = targetFormElementIndex;
                    if (index === null) return;
                    const formElementsCopy = JSON.parse(JSON.stringify(formElements));
                    formElementsCopy.splice(index, 1);
                    setTargetFormElementIndex(null);
                    setFormElements(formElementsCopy);
                }}
            >
                削除
            </button>
            <button
                style={btnStyle}
                disabled={targetFormElementIndex === null}
                onClick={() => {
                    const index = targetFormElementIndex;
                    if (index === null) return;
                    const formElementsCopy = JSON.parse(JSON.stringify(formElements));
                    formElementsCopy.push(formElementsCopy[index]);
                    setTargetFormElementIndex(formElementsCopy.length - 1);
                    setFormElements(formElementsCopy);
                }}
            >
                コピー
            </button>

            <SectionHeader title="操作モード" />
            <button 
                style={{ ...btnStyle, backgroundColor: editMode === "drag" ? "#3b82f6" : undefined, color: editMode === "drag" ? "#fff" : undefined }} 
                onClick={() => setEditMode("drag")}
            >
                Drag
            </button>
            <button 
                style={{ ...btnStyle, backgroundColor: editMode === "resize" ? "#3b82f6" : undefined, color: editMode === "resize" ? "#fff" : undefined }} 
                onClick={() => setEditMode("resize")}
            >
                Resize
            </button>
            <button 
                style={{ ...btnStyle, backgroundColor: editMode === "both" ? "#3b82f6" : undefined, color: editMode === "both" ? "#fff" : undefined }} 
                onClick={() => setEditMode("both")}
            >
                Both
            </button>

            <SectionHeader title="履歴" />
            <button
                style={btnStyle}
                disabled={statePastRecoder.length === 0}
                onClick={() => {
                    if (statePastRecoder.length === 0) return;
                    const statePastRecoderCopy = [...statePastRecoder];
                    const nowRecoder = statePastRecoderCopy.splice(statePastRecoder.length - 1, 1);
                    const recoder = statePastRecoderCopy[statePastRecoderCopy.length - 1];
                    setFormElements([...(recoder !== undefined ? recoder.elements : []).map((e: any) => ({ ...e }))]);
                    setTargetFormElementIndex(recoder !== undefined ? recoder.index : null);
                    setStatePastRecoder(statePastRecoderCopy);
                    setStateFutureRecoder([nowRecoder[0], ...stateFutureRecoder]);
                    setIsDontRecode(true);
                }}
            >
                Undo
            </button>
            <button
                style={btnStyle}
                disabled={stateFutureRecoder.length === 0}
                onClick={() => {
                    if (stateFutureRecoder.length === 0) return;
                    const stateFutureRecoderCopy = [...stateFutureRecoder];
                    const nowRecoder = stateFutureRecoderCopy.splice(0, 1);
                    setFormElements([...nowRecoder[0].elements.map((e: any) => ({ ...e }))]);
                    setTargetFormElementIndex(nowRecoder[0].index);
                    setStateFutureRecoder(stateFutureRecoderCopy);
                    setStatePastRecoder([...statePastRecoder, nowRecoder[0]]);
                    setIsDontRecode(true);
                }}
            >
                Redo
            </button>
        </div>
    );
};
