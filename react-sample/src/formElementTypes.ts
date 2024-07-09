export namespace formElementsTypes {
	interface basePropertiesType {
		w: number;
		h: number;
		x: number;
		y: number;
		label?: string;
	}
	export namespace elementPropertiesOption {
		export interface buttonOption {
			// is_show_button?: boolean;
		}
		export interface closeButtonOption {
			// is_show_close?: boolean;
		}
		export interface textOption {
			text: string;
			// is_show_text?: boolean;
		}
		export interface imageOption {
			texture: string;
			// is_show_image?: boolean;
		}
		export interface hoverTextOption {
			hover_text: string;
			// is_show_hover?: boolean; //実際は使っていない、falseならhover_textを""にするだけ
		}
		export interface customOption {
			buttonOption?: buttonOption;
			closeButtonOption?: closeButtonOption;
			textOption?: textOption;
			imageOption?: imageOption;
			hoverTextOption?: hoverTextOption;
		}
	}
	export namespace elementPropertiesTypes {
		export interface addButton extends basePropertiesType, elementPropertiesOption.buttonOption {}
		export interface addCloseButton extends basePropertiesType, elementPropertiesOption.closeButtonOption {}
		export interface addText extends basePropertiesType, elementPropertiesOption.textOption {}
		export interface addImage extends basePropertiesType, elementPropertiesOption.imageOption {}
		export interface addHoverText extends basePropertiesType, elementPropertiesOption.hoverTextOption {}
		export interface all
			extends basePropertiesType,
				elementPropertiesOption.buttonOption,
				elementPropertiesOption.closeButtonOption,
				elementPropertiesOption.hoverTextOption,
				elementPropertiesOption.imageOption,
				elementPropertiesOption.textOption {
			is_show_button: boolean;
			is_show_close: boolean;
			is_show_text: boolean;
			is_show_image: boolean;
		}
	}
}
