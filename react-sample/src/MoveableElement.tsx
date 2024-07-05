import Moveable from "react-moveable";

const MoveableElement: React.FC<{
	targetElement: HTMLElement | null;
	setTargetElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}> = ({ targetElement }) => {
	return (
		<>
			<Moveable
				target={targetElement}
				resizable={true}
				draggable={true}
				onDrag={(e) => {
					e.target.style.transform = e.transform;
					console.log(e.transform);
					console.log(e.top, e.left);
					// console.log(e.transform.replace("translate(", "").replace(/px/g, "").replace(")", "").split(", "));
				}}
				onResize={(e) => {
					e.target.style.width = `${e.width}px`;
					e.target.style.height = `${e.height}px`;
					e.target.style.transform = e.drag.transform;
				}}
			/>
		</>
	);
};

export default MoveableElement;
