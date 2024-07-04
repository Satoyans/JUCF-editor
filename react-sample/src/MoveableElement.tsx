import Moveable from "react-moveable";

function MoveableElement() {
	return (
		<>
			<Moveable
				target={document.querySelector(".moveable") as HTMLElement}
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
}
export default MoveableElement;

// createRoot(document.getElementById("root")!).render(<App />);
