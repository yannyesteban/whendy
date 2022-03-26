import { Q as $ } from "../Q.js";
import { getParentElement } from "../Tool.js";
import "../WHTab.js";

class GTUnitList extends HTMLElement {

	constructor() {
		super();

		return;
		const template = document.createElement("template");

		template.innerHTML = `
<style>
  :host {
    display:block;
    border:2px solid red;
    
  }

  :host:not(:defined) {
    display:none;
    
  }
</style><slot></slot>

`;

		this.attachShadow({ mode: "open" });

		this.shadowRoot.appendChild(template.content.cloneNode(true));

		const slot = this.shadowRoot.querySelector("slot");

		slot.addEventListener("slotchange", (e) => {
			//const nodes = slot.assignedNodes();
		});

	}

	static get observedAttributes() {
		return ["f", "latitude", "longitude"];
	}

	public connectedCallback() {



	}

	public disconnectedCallback() {
		console.log("disconnectedCallback");
	}

	public attributeChangedCallback(name, oldVal, newVal) {
		console.log("attributeChangedCallback");
		this[name] = newVal;
	}


	test() {
		alert("test")
	}

	public getApp() {
		return getParentElement(this, "wh-app");
	}

	set dataSource(source) {
		$(this).html("");
		const list = $(this).create("wh-list-text");


		const button = $(this).create("button");
		button.html("»");

		customElements.whenDefined('wh-list-text').then(() => {
			list.prop("dataSource", { data: source.data });

		});



	}

}

customElements.define("gt-unit-list", GTUnitList);