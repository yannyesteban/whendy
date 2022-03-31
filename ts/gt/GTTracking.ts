import { Q as $ } from "../Q.js";
import { getParentElement } from "../Tool.js";
import "../WHTab.js";

class GTTracking extends HTMLElement {

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


	test() {
		alert("test")
	}

	public getApp() {
		return getParentElement(this, "wh-app");
	}

	set dataSource(source) {

		console.log(source);
		customElements.whenDefined('gt-unit-store').then(() => {
			const store = this.getStore();

			if (store) {
				store.registerRequest = {
					name: "tracking-data", request: {
						"type": "element",

						"element": "gt-tracking",
						"name": null,
						"method": "tracking-data",
						"config": {

						}
					}
				};

				$(store).on("tracking-data-changed", ({ detail }) => {
					detail.forEach((unit) => {
						const data = store.store;


						data.units[unit.unitId] = Object.assign(data.units[unit.unitId], unit);
						
					});

				});
			}


		});

	}

	getStore() {
		return document.querySelector(`gt-unit-store`);
	}

}

customElements.define("gt-tracking", GTTracking);