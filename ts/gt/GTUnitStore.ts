class GTUnitStore extends HTMLElement {
	
	constructor() {
		super();

		
		
	}

	static get observedAttributes() {
		return [""];
	}

	public connectedCallback() {
		
	}

	public disconnectedCallback() {
		console.log("disconnectedCallback");
	}

	public attributeChangedCallback(name, oldVal, newVal) {
		console.log("attributeChangedCallback");
		
	}

	set dataSource(source){
		console.log(source)
	}
	
}

customElements.define("gt-unit-store", GTUnitStore);