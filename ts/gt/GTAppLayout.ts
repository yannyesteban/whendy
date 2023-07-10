import { Q as $ } from "../Q.js";
import { getParentElement, whenApp } from "../Tool.js";
import "../WHTab.js";
import { GTUnitStore } from "./GTUnitStore.js";

class GTAppLayout extends HTMLElement {
	_win = null;
	_menu = null;

	static get observedAttributes() {
		return [""];
	}

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

	public connectedCallback() {}

	public disconnectedCallback() {
		console.log("disconnectedCallback");
	}

	public attributeChangedCallback(name, oldVal, newVal) {
		console.log("attributeChangedCallback");
	}

	set caption(value) {
		if (Boolean(value)) {
			this.setAttribute("caption", value);
		} else {
			this.removeAttribute("caption");
		}
	}

	get caption() {
		return this.getAttribute("caption");
	}

	public getApp() {
		return getParentElement(this, "wh-app");
	}

	set dataSource(source) {
		console.log(source);
		

		const cW = document.documentElement.clientWidth;
    	const cH = document.documentElement.clientHeight;

		console.log({cW, cH});

		whenApp(this).then((app) => {
			if(cW>=600){
				app.go({
					request: [
						{
							type: "element",
							element: "app",
							name: `${source.APP_PATH}/webcar-desktop.json`,
							method: "init",
						},
					],
				});
			}else{
				app.go({
					request: [
						{
							type: "element",
							element: "app",
							name: `${source.APP_PATH}/webcar-mobil.json`,
							method: "init",
						},
					],
				});
			}
			
		});
	}

	getStore(): GTUnitStore {
		return document.querySelector(`gt-unit-store`);
	}
}

customElements.define("gt-app-layout", GTAppLayout);
