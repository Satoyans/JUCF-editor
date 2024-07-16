import { propsType } from "../propsType";

//ヘッダー
export const Header: React.FC<{
	props: { themeColor: propsType["themeColor"]; setThemeColor: propsType["setThemeColor"] };
}> = ({ props }) => {
	const header_height = 50 - 1;
	return (
		<div id="header" style={{ width: "100%", height: `${header_height}px`, margin: 0, boxShadow: "0 -1px 0 0 black inset", display: "flex", justifyContent: "space-between" }}>
			<div className="title" style={{ margin: "0 0 0 10px" }}>
				<p style={{ margin: 0, fontSize: 36 }}>JUCF-editor</p>
			</div>
			<div style={{ display: "flex", alignItems: "center" }}>
				{/* テーマは全てのボーダーと文字を変えないといけなさそう */}
				{/* 失敗 */}
				{/*<div>
					<button
						onClick={() => {
							props.setThemeColor(props.themeColor === "Light" ? "Dark" : "Light");
							document.querySelector("body")!.style.backgroundColor = props.themeColor === "Light" ? "#444" : "";
						}}
					>
						{props.themeColor}
					</button>
				</div>*/}
				<div className="github_link" style={{ marginLeft: "auto", margin: "0 20px 0 0" }}>
					<a
						href="https://github.com/Satoyans/JUCF_editor"
						target="_blank"
						rel="noopener noreferrer"
						style={{ margin: 0, lineHeight: `${header_height}px`, fontSize: 20 }}
					>
						JUCF-editor
					</a>
				</div>
			</div>
		</div>
	);
};
