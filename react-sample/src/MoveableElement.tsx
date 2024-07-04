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
