import { useAppContext } from "../AppContext";

//ヘッダー
export const Header: React.FC = () => {
	const { themeColor, setThemeColor } = useAppContext();
	const headerHeight = 50 - 1;
	return (
		<div id="header" style={{ width: "100%", height: `${headerHeight}px`, margin: 0, boxShadow: "0 -1px 0 0 black inset", display: "flex", justifyContent: "space-between" }}>
			<div className="title" style={{ margin: "0 0 0 10px" }}>
				<p style={{ margin: 0, fontSize: 36 }}>JUCF-editor</p>
			</div>
			{/* <div style={{ display: "flex", alignItems: "center" }}> */}
			{/* テーマは全てのボーダーと文字を変えないといけなさそう */}
			{/* 失敗 */}
			{/*<div>
					<button
						onClick={() => {
							setThemeColor(themeColor === "Light" ? "Dark" : "Light");
							document.querySelector("body")!.style.backgroundColor = themeColor === "Light" ? "#444" : "";
						}}
					>
						{themeColor}
					</button>
				</div>*/}
			<div className="github_link" style={{ marginLeft: "auto", margin: "0 20px 0 0" }}>
				<img
					style={{ height: "40px", width: "40px", margin: "5px", border: "solid 1px black" }}
					src="./img/github_icon.png"
					alt="github_icon"
					onClick={() => window.open("https://github.com/Satoyans/JUCF_editor")}
				/>
				{/* <a
						href="https://github.com/Satoyans/JUCF_editor"
						target="_blank"
						rel="noopener noreferrer"
						style={{ margin: 0, lineHeight: `${headerHeight}px`, fontSize: 20 }}
					>
						JUCF-editor
					</a>
				*/}
			</div>
			{/* </div> */}
		</div>
	);
};
