class WHIcon extends HTMLElement {
	constructor() {
		super();
		this.slot = "icon";
	}
}
customElements.define("wh-icon", WHIcon);

class WHCaption extends HTMLElement {
	constructor() {
		super();
		this.slot = "caption";
	}
}

customElements.define("wh-caption", WHCaption);