import Moveable, { OnDrag, OnResize } from "react-moveable";
import { formElementsTypes } from "../formElementTypes";

const MoveableElement: React.FC<{
	props: {
		formSize: { x: number; y: number };
		gameScreenSize: { x: number; y: number };
		screenZoomRatio: number;

		targetFormElement: HTMLElement | null;
		setTargetFormElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;

		formElements: formElementsTypes.elementPropertiesTypes.all[];
		setFormElements: React.Dispatch<React.SetStateAction<formElementsTypes.elementPropertiesTypes.all[]>>;
		editMode: "drag" | "resize";
	};
}> = ({ props }) => {
	const form_size = { x: props.formSize.x * props.screenZoomRatio, y: props.formSize.y * props.screenZoomRatio };
	const game_screen_size = { x: props.gameScreenSize.x * props.screenZoomRatio, y: props.gameScreenSize.y * props.screenZoomRatio };

	if (document.querySelector("#screen") === null) return <></>;
	const game_screen_div = document.querySelector("#game_screen") as HTMLDivElement;
	const form_screen_div = document.querySelector("#form_screen") as HTMLDivElement;
	const game_screen_width = Number(game_screen_div.style.width.replace("px", ""));
	const game_screen_height = Number(game_screen_div.style.height.replace("px", ""));
	const form_screen_width = Number(form_screen_div.style.width.replace("px", ""));
	const form_screen_height = Number(form_screen_div.style.height.replace("px", ""));

	const screen_top = 100;
	const screen_left = Math.abs(game_screen_width - form_screen_width) / 2;

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
		if (top > form_screen_height) top = form_screen_height;
		//左
		if (left < -e.width) left = -e.width;
		//右
		if (left > form_screen_width) left = form_screen_width;
		e.target.style.transform = `translate(${left}px, ${top}px)`;

		const index = Number(e.target.id.replace("form_element", ""));
		if (Number.isNaN(index)) throw new Error("form_element index is not a namber");
		const form_elements = JSON.parse(JSON.stringify(props.formElements));
		form_elements[index].x = Number((left / props.screenZoomRatio).toFixed(0));
		form_elements[index].y = Number((top / props.screenZoomRatio).toFixed(0));
		props.setFormElements(form_elements);

		// console.log(e.transform.replace("translate(", "").replace(/px/g, "").replace(")", "").split(", "));
	};

	const onResize = (e: OnResize) => {
		e.target.style.width = `${e.width}px`;
		e.target.style.height = `${e.height}px`;
		e.target.style.transform = e.drag.transform;

		const index = Number(e.target.id.replace("form_element", ""));
		if (Number.isNaN(index)) throw new Error("form_element index is not a namber");
		const form_elements = JSON.parse(JSON.stringify(props.formElements));
		form_elements[index].w = Number((e.width / props.screenZoomRatio).toFixed(0));
		form_elements[index].h = Number((e.height / props.screenZoomRatio).toFixed(0));
		// props.setFormElements(form_elements);

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
		if (top > form_screen_height) top = form_screen_height;
		//左
		if (left < -e.width) left = -e.width;
		//右
		if (left > form_screen_width) left = form_screen_width;
		e.target.style.transform = `translate(${left}px, ${top}px)`;

		// const index = Number(e.target.id.replace("form_element", ""));
		if (Number.isNaN(index)) throw new Error("form_element index is not a namber");
		// const form_elements = JSON.parse(JSON.stringify(props.formElements));
		form_elements[index].x = Number((left / props.screenZoomRatio).toFixed(0));
		form_elements[index].y = Number((top / props.screenZoomRatio).toFixed(0));
		props.setFormElements(form_elements);
	};
	return (
		<Moveable
			target={props.targetFormElement}
			resizable={props.editMode === "resize"}
			draggable={props.editMode === "drag"}
			snappable={true}
			snapContainer={props.targetFormElement?.parentElement}
			snapGridWidth={props.screenZoomRatio}
			snapGridHeight={props.screenZoomRatio}
			onDrag={onDrag}
			onResize={onResize}
		/>
	);
};

export default MoveableElement;
