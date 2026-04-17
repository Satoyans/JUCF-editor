import Moveable, { OnDrag, OnResize, OnDragEnd, OnResizeEnd } from "react-moveable";
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

	// ドラッグ中は見た目だけを更新
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
	};

	// ドラッグ完了時にReactのStateへ保存
	const onDragEnd = (e: OnDragEnd) => {
		const target = e.target as HTMLElement;
		if (!target) return;
		const index = Number(target.id.replace("form_element", ""));
		if (Number.isNaN(index)) return;

		const transform = target.style.transform;
		if (!transform) return;

		let [left, top] = transform
			.replace("translate(", "")
			.replace(/px/g, "")
			.replace(")", "")
			.split(", ")
			.map((num) => Number(num));

		setFormElements((prev) => {
			const formElementsCopy = JSON.parse(JSON.stringify(prev));
			formElementsCopy[index].x = (left / screenZoomRatio).toFixed(0);
			formElementsCopy[index].y = (top / screenZoomRatio).toFixed(0);
			return formElementsCopy;
		});
	};

	// リサイズ中は見た目だけを更新
	const onResize = (e: OnResize) => {
		e.target.style.width = `${e.width}px`;
		e.target.style.height = `${e.height}px`;

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
	};

	// リサイズ完了時にReactのStateへ保存
	const onResizeEnd = (e: OnResizeEnd) => {
		const target = e.target as HTMLElement;
		if (!target) return;
		const index = Number(target.id.replace("form_element", ""));
		if (Number.isNaN(index)) return;

		const width = Number(target.style.width.replace("px", ""));
		const height = Number(target.style.height.replace("px", ""));

		const transform = target.style.transform;
		let left = 0, top = 0;
		if (transform) {
			[left, top] = transform
				.replace("translate(", "")
				.replace(/px/g, "")
				.replace(")", "")
				.split(", ")
				.map((num) => Number(num));
		}

		setFormElements((prev) => {
			const formElementsCopy = JSON.parse(JSON.stringify(prev));
			formElementsCopy[index].w = (width / screenZoomRatio).toFixed(0);
			formElementsCopy[index].h = (height / screenZoomRatio).toFixed(0);
			formElementsCopy[index].x = (left / screenZoomRatio).toFixed(0);
			formElementsCopy[index].y = (top / screenZoomRatio).toFixed(0);
			return formElementsCopy;
		});
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
			onDragEnd={onDragEnd}
			onResize={onResize}
			onResizeEnd={onResizeEnd}
		/>
	);
};

export default MoveableElement;
