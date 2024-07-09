//ヘッダー
export const Header: React.FC = () => {
	const header_height = 50 - 1;
	return (
		<div id="header" style={{ width: "100%", height: `${header_height}px`, margin: 0, boxShadow: "0 -1px 0 0 black inset", display: "flex", justifyContent: "space-between" }}>
			<div className="title" style={{ margin: "0 0 0 10px" }}>
				<p style={{ margin: 0, fontSize: 36 }}>JUCF-editor</p>
			</div>
			<div className="github_link" style={{ marginLeft: "auto", margin: "0 20px 0 0" }}>
				<a href="https://github.com/Satoyans/JUCF_editor" target="_blank" rel="noopener noreferrer" style={{ margin: 0, lineHeight: `${header_height}px`, fontSize: 20 }}>
					JUCF-editor
				</a>
			</div>
		</div>
	);
};
