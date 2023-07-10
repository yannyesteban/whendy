import { Q as $ } from "./Q.js";

import { Float } from "./Float.js";

const KEYCODE = {
	DOWN: 40,
	LEFT: 37,
	RIGHT: 39,
	UP: 38,
	HOME: 36,
	END: 35,
};
function eliminarDiacriticosEs(texto) {
	/*texto.normalize('NFD')
     .replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi,"$1$2")
     .normalize(); */


    return texto
           .normalize('NFD')
           .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1")
           .normalize();
}

const removeAccents = (str) => {
	return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  } 

const acute = (str) => {

	if (str === undefined) {
		return false;
	}

	str = str.toLowerCase()
	str = str.replace(/á/gi, "a");
	str = str.replace(/é/gi, "e");
	str = str.replace(/í/gi, "i");
	str = str.replace(/ó/gi, "o");
	str = str.replace(/ú/gi, "u");
	//str = str.replace(/ñ/gi, "n");
	return str;

};

class WHOption extends HTMLElement {

	constructor() {

		super();

		//this.slot = "icon";
	}
	set value(value) {

		const isTrue = Boolean(value);
		if (isTrue) {
			this.setAttribute('value', value);
		} else {
			this.removeAttribute('value');
		}
	}

	get value() {

		return this.getAttribute('value');
	}
	set selected(value) {
		const isTrue = Boolean(value);
		if (isTrue) {
			this.setAttribute('selected', '');
		} else {
			this.removeAttribute('selected');
		}
	}

	get selected() {
		return this.hasAttribute('selected');
	}
}
customElements.define("wh-option", WHOption);

class ListText extends HTMLElement {



	valid = false;
	public menu;
	public input;
	public internals_;

	static formAssociated = true;

	static get observedAttributes() {
		return ["value", "name"];
	}


	constructor() {
		super();

		const template = document.createElement("template");
		this.internals_ = this.attachInternals();
		template.innerHTML = `
		
			<link rel="stylesheet" href="./../css/ListText.css">
			<input class="main input"/>

			<div class="menu">
				<slot name="ok"></slot>
			</div>

			<div class="light">
				<slot></slot>
			</div>


			`;

		this.attachShadow({ mode: "open", delegatesFocus: true });

		this.shadowRoot.appendChild(template.content.cloneNode(true));

		const slot = this.shadowRoot.querySelector("slot");

		slot.addEventListener("slotchange", (e) => {
			//const nodes = slot.assignedNodes();
		});

		
		
		

	}


	public connectedCallback() {

		const input = this.input;
		const menu = this.menu;

		Float.init(this.menu)

		input.setAttribute('tabindex', '0');
		menu.setAttribute('tabindex', '-1');

		if (!this.hasAttribute('role')) {
			this.setAttribute('role', 'radio');
		}

		if (!this.hasAttribute('tabindex')) {

		}

		$(this.input).on("focus", (e) => {
			$(this).addClass("active");
			this.render();
		})


		$(input).on("keydown", $.bind(this._keyDown, this));
		$(input).on("keyup", $.bind(this._keyUp, this))
			.on("change", () => {
				if (!this.textValid()) {
					this.value = "";
				}
			});

		$(menu).on("click", (event) => {
			if (event.target.tagName.toLowerCase() === "wh-option") {
				this.value = event.target.value;
				//this.blur();
			}

			$(this).removeClass("active");
		});

		this._upgradeProperty('group');
		this._upgradeProperty("value");

		this.fixValue(this.value);
	}

	public disconnectedCallback() {
		console.log("disconnectedCallback");
	}

	public attributeChangedCallback(name, oldValue, newValue) {

		const hasValue = newValue !== null;

		switch (name) {
			case 'value':
				this.internals_.setFormValue(this.getAttribute("value"));
				return;
			case 'checked':
				this.setAttribute('aria-checked', String(hasValue));
				break;
			case 'disabled':
				this.setAttribute('aria-disabled', String(hasValue));
				// The `tabindex` attribute does not provide a way to fully remove
				// focusability from an element.
				// Elements with `tabindex=-1` can still be focused with
				// a mouse or by calling `focus()`.
				// To make sure an element is disabled and not focusable, remove the
				// `tabindex` attribute.
				if (hasValue) {
					this.removeAttribute('tabindex');
					// If the focus is currently on this element, unfocus it by
					// calling the `HTMLElement.blur()` method.
					this.blur();
				} else {
					this.setAttribute('tabindex', '0');
				}
				break;
		}

	}

	



	

	public set value(value) {

		value = this.fixValue(value);

		if (Boolean(value)) {
			this.setAttribute("value", value);
		} else {
			this.setAttribute("value", "");
		}
		
	}

	public get value() {
		return this.getAttribute("value");
	}

	public fixValue(value) {

		let option = null;

		if (this.filtered) {
			option = $(this).query(`[value="${value}"][data-group="${this.group}"]`);
		} else {
			option = $(this).query(`[value="${value}"]`);
		}

		const isValid = Boolean(option);

		this.input.value = isValid ? option.html() : "";

		if (isValid) {
			$(this).addClass("valid");
		} else {
			$(this).removeClass("valid");
		}

		this.valid = isValid;
		return value;
	}

	

	

	_upgradeProperty(prop) {

		if (this.hasOwnProperty(prop)) {

			let value = this[prop];
			delete this[prop];
			this[prop] = value;
		}
	}

	_keyUp(event) {

		switch (event.keyCode) {
			case 9://tab

				break;
			case 13://enter

				
				return;

				break;
			case 27://escape
				break;
			case KEYCODE.UP://up arrow

				return;
			case KEYCODE.DOWN://down arrow

				return;
			default:

				break;
		}

		this.render();
	}

	_keyDown(event) {


		switch (event.keyCode) {
			case 9://tab

				break;
			case 13://enter


				break;
			case 27://escape
				break;
			case KEYCODE.UP://up arrow
				
				break;
			case KEYCODE.DOWN://down arrow
				
				break;

		}
	}

	

	

	

	

	
	toggleActive() {

		this.classList.toggle("active");
	}

	onInput() {
		
		this.internals_.setValidity({});
		this.internals_.setFormValue(this.value);
		return;
		if (!this.matches(':disabled') && this.hasAttribute('required') &&
			this.value.length < 5)
		  this.internals_.setValidity({customError: true}, 'Use at least 5 characters.',);
		else
		  this.internals_.setValidity({});
		this.internals_.setFormValue(this.value);
	  }

	formAssociatedCallback(nullableForm) {
		console.log('Form associated.');
	}

	// New lifecycle callback. This is called when ‘disabled’ attribute of
	// this element or an ancestor <fieldset> is updated.
	formDisabledCallback(disabled) {
		// Do something.  e.g. adding/removing ‘disabled’ content attributes
		// to/from form controls in this shadow tree.
		if (disabled) {
			console.log('is disabled');
		}
	}

	// New lifecycle callback. This is called when the owner form is reset.
	formResetCallback() {
		this.value = this.getAttribute('value') || '';
		this.onInput();
	}

	// New lifecycle callback. This is called when the browser wants to
	// restore user-visible state.
	formStateRestoreCallback(state, mode) {
		this.value = state;
		this.onInput();
	}

	get form() { return this.internals_.form; }

	set name(value){
		if (Boolean(value)) {
			this.setAttribute("name", value);
		} else {
			this.removeAttribute("name");
		}
	}

	get name() { 
		return this.getAttribute('name')
	};

    get type() { return this.localName; }

	get validity() { return this.internals_.validity; }
	get validationMessage() { return this.internals_.validationMessage; }
	get willValidate() { return this.internals_.willValidate; }

	checkValidity() { return this.internals_.checkValidity(); }
	reportValidity() { return this.internals_.reportValidity(); }

}

customElements.define("wh-list-text", ListText);
