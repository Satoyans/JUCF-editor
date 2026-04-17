import Moveable, { OnDrag, OnResize } from "react-moveable";
import { useAppContext } from "../../AppContext";

const MoveableElement: React.FC = () => {
	const {
		formSize,
		gameScreenSize,
		screenZoomRatio,
		targetFormElement,
		formElements,
		setFormElements,
		editMode,
	} = useAppContext();

	if (document.querySelector("#screen") === null) return <></>;
	const gameScreenDiv = document.querySelector("#game_screen") as HTMLDivElement;
	const formScreenDiv = document.querySelector("#form_screen") as HTMLDivElement;
	const gameScreenWidth = Number(gameScreenDiv.style.width.replace("px", ""));
	const gameScreenHeight = Number(gameScreenDiv.style.height.replace("px", ""));
	const formScreenWidth = Number(formScreenDiv.style.width.replace("px", ""));
	const formScreenHeight = Number(formScreenDiv.style.height.replace("px", ""));

	// const screenTop = 100;
	// const screenLeft = Math.abs(gameScreenWidth - formScreenWidth) / 2;

	const onDrag = (e: OnDrag) => {
		let [left, top] = e.transform
			.replace("translate(", "")
			.replace(/px/g, "")
			.replace(")", "")
			.split(", ")
			.map((num) => Number(num));
		//上
		if (top < -e.height) top = -e.height;
		//下
		if (top > formScreenHeight) top = formScreenHeight;
		//左
		if (left < -e.width) left = -e.width;
		//右
		if (left > formScreenWidth) left = formScreenWidth;
		e.target.style.transform = `translate(${left}px, ${top}px)`;

		const index = Number(e.target.id.replace("form_element", ""));
		if (Number.isNaN(index)) throw new Error("form_element index is not a namber");
		const formElementsCopy = JSON.parse(JSON.stringify(formElements));
		formElementsCopy[index].x = (left / screenZoomRatio).toFixed(0);
		formElementsCopy[index].y = (top / screenZoomRatio).toFixed(0);
		setFormElements(formElementsCopy);
	};

	const onResize = (e: OnResize) => {
		e.target.style.width = `${e.width}px`;
		e.target.style.height = `${e.height}px`;
		e.target.style.transform = e.drag.transform;

		const index = Number(e.target.id.replace("form_element", ""));
		if (Number.isNaN(index)) throw new Error("form_element index is not a namber");
		const formElementsCopy = JSON.parse(JSON.stringify(formElements));
		formElementsCopy[index].w = (e.width / screenZoomRatio).toFixed(0);
		formElementsCopy[index].h = (e.height / screenZoomRatio).toFixed(0);

		//onDragの処理
		let [left, top] = e.transform
			.replace("translate(", "")
			.replace(/px/g, "")
			.replace(")", "")
			.split(", ")
			.map((num) => Number(num));
		//上
		if (top < -e.height) top = -e.height;
		//下
		if (top > formScreenHeight) top = formScreenHeight;
		//左
		if (left < -e.width) left = -e.width;
		//右
		if (left > formScreenWidth) left = formScreenWidth;
		e.target.style.transform = `translate(${left}px, ${top}px)`;

		if (Number.isNaN(index)) throw new Error("form_element index is not a namber");
		formElementsCopy[index].x = (left / screenZoomRatio).toFixed(0);
		formElementsCopy[index].y = (top / screenZoomRatio).toFixed(0);
		setFormElements(formElementsCopy);
	};
	return (
		<Moveable
			target={targetFormElement}
			resizable={editMode === "resize" || editMode === "both"}
			draggable={editMode === "drag" || editMode === "both"}
			snappable={true}
			snapContainer={targetFormElement?.parentElement}
			snapGridWidth={screenZoomRatio}
			snapGridHeight={screenZoomRatio}
			onDrag={onDrag}
			onResize={onResize}
		/>
	);
};

export default MoveableElement;
