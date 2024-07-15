export const variableReplacer = (original_text: string, variables: { [key: string]: string | number | boolean }) => {
	console.log(original_text);
	const split_texts = original_text.split("%");
	let count = 0;
	const variable_texts: string[] = [];
	for (let split_text of split_texts) {
		count += 1;
		if (split_text.endsWith("\\")) {
			count -= 1;
		}
		if (count === 2) {
			variable_texts.push(split_text);
			count = 0;
		}
	}

	let target_text = String(original_text);
	for (let variable_text of variable_texts) {
		if (variables[variable_text] === undefined) continue;
		target_text = target_text.replace(`%${variable_text}%`, String(variables[variable_text]));
	}
	return target_text.replaceAll("\\%", "%");
};
