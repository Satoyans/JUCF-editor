export namespace formElementsTypes {
	interface basePropertiesType {
		w: number;
		h: number;
		x: number;
		y: number;
		label?: string;
	}
	export namespace elementPropertiesOption {
		export interface buttonOption {}
		export interface closeButtonOption {}
		export interface textOption {
			text: string;
		}
		export interface imageOption {
			texture: string;
		}
		export interface hoverTextOption {
			hover_text: string;
		}
		export interface itemRendererOption {
			aux: number;
		}
		export interface customOption {
			buttonOption?: buttonOption;
			closeButtonOption?: closeButtonOption;
			textOption?: textOption;
			imageOption?: imageOption;
			hoverTextOption?: hoverTextOption;
			itemRendererOption?: itemRendererOption;
		}
	}
	export namespace elementPropertiesTypes {
		export interface addButton extends basePropertiesType, elementPropertiesOption.buttonOption {}
		export interface addCloseButton extends basePropertiesType, elementPropertiesOption.closeButtonOption {}
		export interface addText extends basePropertiesType, elementPropertiesOption.textOption {}
		export interface addImage extends basePropertiesType, elementPropertiesOption.imageOption {}
		export interface addHoverText extends basePropertiesType, elementPropertiesOption.hoverTextOption {}
		export interface addItemRenderer extends basePropertiesType, elementPropertiesOption.itemRendererOption {}
		export interface all
			extends basePropertiesType,
				elementPropertiesOption.buttonOption,
				elementPropertiesOption.closeButtonOption,
				elementPropertiesOption.hoverTextOption,
				elementPropertiesOption.imageOption,
				elementPropertiesOption.itemRendererOption,
				elementPropertiesOption.textOption {
			is_show_button: boolean;
			is_show_close: boolean;
			is_show_text: boolean;
			is_show_image: boolean;
			is_show_item: boolean;
		}
	}
}

export namespace formElementsVariableTypes {
	interface basePropertiesType {
		w: string; //変数使えるように
		h: string; //変数使えるように
		x: string; //変数使えるように
		y: string; //変数使えるように
		label?: string;
	}
	export namespace elementPropertiesOption {
		export interface buttonOption {
			command: string;
		}
		export interface closeButtonOption {}
		export interface textOption {
			text: string;
		}
		export interface imageOption {
			texture: string;
		}
		export interface hoverTextOption {
			hover_text: string;
		}
		export interface itemRendererOption {
			aux: string; //変数のため
		}
		export interface customOption {
			buttonOption?: buttonOption;
			closeButtonOption?: closeButtonOption;
			textOption?: textOption;
			imageOption?: imageOption;
			hoverTextOption?: hoverTextOption;
			itemRendererOption?: itemRendererOption;
		}
	}
	export namespace elementPropertiesTypes {
		export interface addButton extends basePropertiesType, elementPropertiesOption.buttonOption {}
		export interface addCloseButton extends basePropertiesType, elementPropertiesOption.closeButtonOption {}
		export interface addText extends basePropertiesType, elementPropertiesOption.textOption {}
		export interface addImage extends basePropertiesType, elementPropertiesOption.imageOption {}
		export interface addHoverText extends basePropertiesType, elementPropertiesOption.hoverTextOption {}
		export interface addItemRenderer extends basePropertiesType, elementPropertiesOption.itemRendererOption {}
		export interface all
			extends basePropertiesType,
				elementPropertiesOption.buttonOption,
				elementPropertiesOption.closeButtonOption,
				elementPropertiesOption.hoverTextOption,
				elementPropertiesOption.imageOption,
				elementPropertiesOption.itemRendererOption,
				elementPropertiesOption.textOption {
			is_show_button: string; //変数使えるように
			is_show_close: string; //変数使えるように
			is_show_text: string; //変数使えるように
			is_show_image: string; //変数使えるように
			is_show_item: string; //変数使えるように
		}
	}
}
