import { formElementsTypes, formElementsVariableTypes } from "./formElementTypes";

export type propsType = {
	showFormFrame: string;
	setShowFormFrame: React.Dispatch<React.SetStateAction<string>>;
	formName: string;
	setFormName: React.Dispatch<React.SetStateAction<string>>;
	selectedTab: "screen" | "image" | "variable";
	setSelectedTab: React.Dispatch<React.SetStateAction<"screen" | "image" | "variable">>;
	themeColor: "Light" | "Dark";
	setThemeColor: React.Dispatch<React.SetStateAction<"Light" | "Dark">>;
	gameScreenSize: {
		x: number;
		y: number;
	};
	setGameScreenSize: React.Dispatch<
		React.SetStateAction<{
			x: number;
			y: number;
		}>
	>;
	formSize: {
		x: number;
		y: number;
	};
	setFormSize: React.Dispatch<
		React.SetStateAction<{
			x: number;
			y: number;
		}>
	>;

	formId: string;
	setFormId: React.Dispatch<React.SetStateAction<string>>;
	targetFormElementIndex: number | null;
	setTargetFormElementIndex: React.Dispatch<React.SetStateAction<number | null>>;
	targetFormElement: HTMLElement | null;
	setTargetFormElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
	formElements: formElementsVariableTypes.elementPropertiesTypes.all[];
	setFormElements: React.Dispatch<React.SetStateAction<formElementsVariableTypes.elementPropertiesTypes.all[]>>;
	elementPanelHeight: number;
	setElementPanelHeight: React.Dispatch<React.SetStateAction<number>>;
	screenZoomRatio: number;
	setScreenZoomRatio: React.Dispatch<React.SetStateAction<number>>;
	editMode: "drag" | "resize";
	setEditMode: React.Dispatch<React.SetStateAction<"drag" | "resize">>;
	uploadedImages: {
		[path: string]: string;
	};
	setUploadedImages: React.Dispatch<
		React.SetStateAction<{
			[path: string]: string;
		}>
	>;
	gameScreenSizeVariable: {
		x: string;
		y: string;
	};
	setGameScreenSizeVariable: React.Dispatch<
		React.SetStateAction<{
			x: string;
			y: string;
		}>
	>;
	formSizeVariable: {
		x: string;
		y: string;
	};
	setFormSizeVariable: React.Dispatch<
		React.SetStateAction<{
			x: string;
			y: string;
		}>
	>;
	variable: {
		[key: string]: string | number | boolean;
	};
	setVariable: React.Dispatch<
		React.SetStateAction<{
			[key: string]: string | number | boolean;
		}>
	>;
};
